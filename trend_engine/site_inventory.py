from __future__ import annotations

import json
import re
import xml.etree.ElementTree as ET
from pathlib import Path
from urllib.parse import urlparse

import frontmatter
import requests
from bs4 import BeautifulSoup
from rapidfuzz import fuzz

from .models import SitePage
from .utils import absolute_url, read_text_safe


def _title_from_body(body: str, fallback: str) -> str:
    match = re.search(r"^#\s+(.+)$", body, re.MULTILINE)
    return match.group(1).strip() if match else fallback


def _strip_markup(text: str) -> str:
    text = re.sub(r"```.*?```", " ", text, flags=re.S)
    text = re.sub(r"<[^>]+>", " ", text)
    text = re.sub(r"[#*_`>\[\](){}]", " ", text)
    return re.sub(r"\s+", " ", text).strip()


def _json_body(article: dict) -> str:
    parts: list[str] = []

    for key in ("title", "excerpt", "directAnswer"):
        value = article.get(key)
        if value:
            parts.append(str(value))

    for fact in article.get("keyFacts") or []:
        if isinstance(fact, dict):
            parts.extend([
                str(fact.get("label") or ""),
                str(fact.get("value") or ""),
            ])

    for section in article.get("sections") or []:
        if not isinstance(section, dict):
            continue
        parts.append(str(section.get("heading") or ""))
        for paragraph in section.get("paragraphs") or []:
            parts.append(str(paragraph))

    for faq in article.get("faqs") or []:
        if isinstance(faq, dict):
            parts.extend([
                str(faq.get("question") or ""),
                str(faq.get("answer") or ""),
            ])

    return _strip_markup(" ".join(parts))


def _content_url(settings, path: Path, metadata: dict) -> str:
    for key in ("permalink", "url", "canonical"):
        value = metadata.get(key)
        if isinstance(value, str) and value.strip():
            return absolute_url(settings.site_url, value.strip())

    slug = str(metadata.get("slug") or path.stem).strip("/")
    return absolute_url(
        settings.site_url,
        settings.route_prefix + slug + "/",
    )


def _page_url(settings, path: Path) -> str:
    rel = path.relative_to(settings.pages_dir)
    parts = list(rel.parts)
    stem = Path(parts[-1]).stem
    parts[-1] = "" if stem == "index" else stem
    route = "/" + "/".join(part for part in parts if part) + "/"
    return absolute_url(settings.site_url, route)


def _live_title(url: str) -> str:
    parsed = urlparse(url)
    pieces = [
        piece
        for piece in parsed.path.strip("/").split("/")
        if piece
    ]
    if not pieces:
        return "Wild Excursions"
    return " ".join(pieces[-2:]).replace("-", " ").replace("_", " ").title()


def _sitemap_urls(site_url: str) -> list[str]:
    headers = {
        "User-Agent": "Mozilla/5.0 WildExcursionsInventory/1.0"
    }
    start = site_url.rstrip("/") + "/sitemap-index.xml"

    def fetch_xml(url: str) -> ET.Element | None:
        try:
            response = requests.get(
                url,
                timeout=20,
                headers=headers,
            )
            if not response.ok:
                return None
            return ET.fromstring(response.content)
        except Exception:
            return None

    root = fetch_xml(start)
    if root is None:
        return []

    locs = [
        (node.text or "").strip()
        for node in root.findall(".//{*}loc")
        if (node.text or "").strip()
    ]

    root_name = root.tag.rsplit("}", 1)[-1].lower()
    if root_name == "urlset":
        return locs

    urls: list[str] = []
    for sitemap_url in locs[:50]:
        child = fetch_xml(sitemap_url)
        if child is None:
            continue
        urls.extend([
            (node.text or "").strip()
            for node in child.findall(".//{*}loc")
            if (node.text or "").strip()
        ])

    return urls


def build_site_inventory(settings) -> list[SitePage]:
    pages: list[SitePage] = []
    seen_urls: set[str] = set()

    def add(page: SitePage):
        if not page.url or page.url in seen_urls:
            return
        seen_urls.add(page.url)
        pages.append(page)

    # 1) Local /updates/*.json files.
    if settings.content_dir.exists():
        for path in settings.content_dir.rglob("*.json"):
            try:
                article = json.loads(
                    path.read_text(
                        encoding="utf-8",
                        errors="ignore",
                    )
                )
            except Exception:
                continue

            if not isinstance(article, dict):
                continue

            # Draft-only technical/test pages should not influence dedupe.
            if bool(article.get("draft")):
                continue

            add(SitePage(
                file_path=str(path),
                url=_content_url(settings, path, article),
                title=str(
                    article.get("title")
                    or path.stem.replace("-", " ").title()
                ),
                description=str(
                    article.get("metaDescription")
                    or article.get("excerpt")
                    or ""
                ),
                body_excerpt=_json_body(article)[:5000],
                search_intent=str(
                    article.get("searchIntent")
                    or article.get("search_intent")
                    or ""
                ),
                primary_keyword=str(
                    article.get("primaryKeyword")
                    or article.get("primary_keyword")
                    or ""
                ),
                file_type=".json",
            ))

    # 2) Any traditional Markdown/MDX content still present elsewhere.
    src_content = settings.root / "src" / "content"
    if src_content.exists():
        for path in src_content.rglob("*"):
            if path.suffix.lower() not in {".md", ".mdx"}:
                continue
            raw = read_text_safe(path, 50_000)
            try:
                post = frontmatter.loads(raw)
                meta = dict(post.metadata)
                body = post.content
            except Exception:
                meta, body = {}, raw

            title = str(
                meta.get("title")
                or _title_from_body(
                    body,
                    path.stem.replace("-", " ").title(),
                )
            )
            slug = str(meta.get("slug") or path.stem).strip("/")
            url = absolute_url(
                settings.site_url,
                "/blogs/" + slug + "/",
            )
            add(SitePage(
                file_path=str(path),
                url=url,
                title=title,
                description=str(
                    meta.get("description")
                    or meta.get("excerpt")
                    or ""
                ),
                body_excerpt=_strip_markup(body)[:4000],
                search_intent=str(
                    meta.get("searchIntent")
                    or meta.get("search_intent")
                    or ""
                ),
                primary_keyword=str(
                    meta.get("primaryKeyword")
                    or meta.get("primary_keyword")
                    or ""
                ),
                file_type=path.suffix.lower(),
            ))

    # 3) Static Astro routes. Dynamic templates such as [slug].astro are skipped.
    if settings.pages_dir.exists():
        for path in settings.pages_dir.rglob("*.astro"):
            rel = path.relative_to(settings.pages_dir)
            if any("[" in part or "]" in part for part in rel.parts):
                continue

            raw = read_text_safe(path, 30_000)
            title_match = re.search(
                r"<title[^>]*>(.*?)</title>",
                raw,
                re.S | re.I,
            )
            h1_match = re.search(
                r"<h1[^>]*>(.*?)</h1>",
                raw,
                re.S | re.I,
            )

            title = ""
            if title_match:
                title = BeautifulSoup(
                    title_match.group(1),
                    "html.parser",
                ).get_text(" ", strip=True)

            if not title and h1_match:
                title = BeautifulSoup(
                    h1_match.group(1),
                    "html.parser",
                ).get_text(" ", strip=True)

            if not title:
                title = path.stem.replace("-", " ").title()

            add(SitePage(
                file_path=str(path),
                url=_page_url(settings, path),
                title=title,
                body_excerpt=_strip_markup(raw)[:3000],
                file_type=".astro",
            ))

    # 4) Production sitemap inventory.
    # This is important because the Astro project generates many dynamic URLs
    # from TS/JSON data that do not exist as individual local .astro files.
    for url in _sitemap_urls(settings.site_url):
        add(SitePage(
            file_path="LIVE_SITEMAP",
            url=url,
            title=_live_title(url),
            description="",
            body_excerpt="",
            search_intent="",
            primary_keyword="",
            file_type=".live",
        ))

    return pages


def shortlist_pages(
    query: str,
    pages: list[SitePage],
    limit: int = 15,
) -> list[SitePage]:
    scored = []

    for page in pages:
        target = " ".join([
            page.title,
            page.primary_keyword,
            page.description,
            page.url.replace("-", " "),
        ])

        score = fuzz.token_set_ratio(
            query.lower(),
            target.lower(),
        )

        if score >= 25:
            scored.append((score, page))

    scored.sort(
        key=lambda item: item[0],
        reverse=True,
    )

    return [
        page
        for _, page in scored[:limit]
    ]