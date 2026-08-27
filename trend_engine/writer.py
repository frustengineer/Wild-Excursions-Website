from __future__ import annotations

from datetime import datetime
from pathlib import Path
from urllib.parse import urlparse
import json
import re

from .utils import slugify, absolute_url


def _clean_text(value, fallback: str = "") -> str:
    text = str(value or fallback).strip()
    return re.sub(r"\s+", " ", text)


def _iso_date(now_local: datetime) -> str:
    return now_local.strftime("%Y-%m-%d")


def _normalize_source(src: dict) -> dict | None:
    if not isinstance(src, dict):
        return None

    url = _clean_text(src.get("url"))
    if not url.startswith(("http://", "https://")):
        return None

    label = _clean_text(
        src.get("title")
        or src.get("publisher")
        or src.get("name")
        or url
    )

    out = {
        "label": label,
        "url": url,
    }

    publisher = _clean_text(src.get("publisher"))
    if publisher:
        out["publisher"] = publisher

    source_type = _clean_text(
        src.get("source_type")
        or src.get("sourceType")
    )
    if source_type:
        out["sourceType"] = source_type

    published_at = _clean_text(
        src.get("published_at")
        or src.get("publishedAt")
    )
    if published_at:
        out["publishedAt"] = published_at

    return out


def _normalize_sources(
    sources: list[dict],
    limit: int = 10
) -> list[dict]:
    result: list[dict] = []
    seen: set[str] = set()

    for src in sources or []:
        normalized = _normalize_source(src)

        if not normalized:
            continue

        url = normalized["url"]

        if url in seen:
            continue

        seen.add(url)
        result.append(normalized)

        if len(result) >= limit:
            break

    return result


def _internal_href(
    site_url: str,
    page_url: str
) -> str:
    try:
        site = urlparse(site_url)
        page = urlparse(page_url)

        if page.netloc and page.netloc == site.netloc:
            path = page.path or "/"
            return path if path.endswith("/") else path + "/"

    except Exception:
        pass

    return page_url


def _related_links(
    settings,
    related_pages,
    limit: int = 5
) -> list[dict]:
    links = []
    seen = set()

    for page in related_pages[:limit]:
        href = _internal_href(
            settings.site_url,
            page.url
        )

        if not href or href in seen:
            continue

        seen.add(href)

        links.append({
            "label": page.title,
            "href": href,
        })

    return links


def _ensure_object(payload) -> dict:
    if not isinstance(payload, dict):
        raise ValueError(
            "Writer returned a non-object JSON payload"
        )

    return payload


def _paragraphs(value) -> list[str]:
    if not isinstance(value, list):
        return []

    return [
        _clean_text(x)
        for x in value
        if _clean_text(x)
    ]


def _sections(value) -> list[dict]:
    if not isinstance(value, list):
        return []

    result = []

    for section in value:
        if not isinstance(section, dict):
            continue

        heading = _clean_text(
            section.get("heading")
        )

        paragraphs = _paragraphs(
            section.get("paragraphs")
        )

        if heading and paragraphs:
            result.append({
                "heading": heading,
                "paragraphs": paragraphs,
            })

    return result


def _faqs(value) -> list[dict]:
    if not isinstance(value, list):
        return []

    result = []

    for item in value:
        if not isinstance(item, dict):
            continue

        question = _clean_text(
            item.get("question")
        )

        answer = _clean_text(
            item.get("answer")
        )

        if question and answer:
            result.append({
                "question": question,
                "answer": answer,
            })

    return result[:6]


def _key_facts(value) -> list[dict]:
    if not isinstance(value, list):
        return []

    result = []

    for item in value:
        if not isinstance(item, dict):
            continue

        label = _clean_text(
            item.get("label")
        )

        fact_value = _clean_text(
            item.get("value")
        )

        if label and fact_value:
            result.append({
                "label": label,
                "value": fact_value,
            })

    return result[:8]


def _validate_article(article: dict) -> None:
    required = (
        "slug",
        "title",
        "metaTitle",
        "metaDescription",
        "publishedAt",
        "directAnswer",
    )

    missing = [
        key
        for key in required
        if not _clean_text(article.get(key))
    ]

    if missing:
        raise ValueError(
            "Generated update JSON is missing required "
            f"fields: {', '.join(missing)}"
        )

    if not article.get("sections"):
        raise ValueError(
            "Generated update JSON has no usable sections"
        )


def generate_new_article(
    llm,
    settings,
    candidate,
    research: dict,
    related_pages,
    now_local: datetime,
) -> tuple[Path, str, str]:

    today = _iso_date(now_local)

    primary_keyword = _clean_text(
        research.get("recommended_angle")
        or research.get("suggested_primary_keyword")
        or candidate.query
    )

    topic = _clean_text(
        research.get("topic")
        or candidate.query
    )

    slug = slugify(topic)

    url = absolute_url(
        settings.site_url,
        settings.route_prefix + slug + "/",
    )

    research_sources = _normalize_sources(
        research.get("sources") or [],
        limit=10,
    )

    related_links = _related_links(
        settings,
        related_pages,
        limit=5,
    )

    prompt = f"""
Create a publication-ready Wild Excursions UPDATE ARTICLE
as a JSON object.

Topic/trend:
{candidate.query}

Recommended angle / primary keyword:
{primary_keyword}

Current date in India:
{now_local.strftime('%d %B %Y')}

Research dossier:
{json.dumps(research, ensure_ascii=False)}

Allowed related internal links:
{json.dumps(related_links, ensure_ascii=False)}

Available verified sources:
{json.dumps(research_sources, ensure_ascii=False)}

The Astro template already renders:

- H1
- author/date
- Quick Answer
- Key Facts
- article sections
- FAQs
- sources
- reviewer
- related links

Return ONLY a JSON object with these fields:

{{
  "title": "clear human-facing H1",
  "metaTitle": "SEO title WITHOUT | Wild Excursions",
  "metaDescription": "accurate useful meta description",
  "excerpt": "1-2 sentence summary",
  "category": "short category",
  "primaryKeyword": "main query/topic",
  "searchIntent": "informational|commercial|transactional|comparison|travel-update|news",
  "directAnswer": "2-4 sentences answering the main user need immediately",
  "keyFacts": [
    {{
      "label": "...",
      "value": "..."
    }}
  ],
  "sections": [
    {{
      "heading": "...",
      "paragraphs": [
        "...",
        "..."
      ]
    }}
  ],
  "faqs": [
    {{
      "question": "...",
      "answer": "..."
    }}
  ]
}}

SEO / GEO / AEO rules:

- Human usefulness first.
- No generic AI opening such as
  "Nestled in the heart of..."
- directAnswer must provide the main answer
  immediately and precisely.
- Use 3-7 useful sections.
- Use question-led or decision-helpful headings
  where natural.
- Every factual claim must be supportable by
  the research dossier.
- Never invent prices, timings, permit rules,
  closures, gate status, distances, sightings,
  statistics, or operator claims.
- If information is uncertain or conflicting,
  clearly state that instead of guessing.
- Explain what the information means for an
  Indian wildlife traveller.
- Prefer concise, specific language over filler.
- Do not keyword-stuff.
- Key Facts must contain only verified facts.
- Add 3-6 FAQs only when genuinely useful.
- Do not include URLs inside paragraphs.
- Do not claim first-hand Wild Excursions
  experience unless it exists in the dossier.
- Do not add "| Wild Excursions" to metaTitle.
  The global Astro Layout adds it automatically.
- Do not include schema.
- Do not include HTML.
- Do not include Markdown.
- Do not include an H1.
- Do not include frontmatter.
"""

    payload = _ensure_object(
        llm.json(prompt)
    )

    article = {
        "draft": False,

        "slug": slug,

        "title": _clean_text(
            payload.get("title")
            or topic
        ),

        "metaTitle": _clean_text(
            payload.get("metaTitle")
            or payload.get("title")
            or topic
        ),

        "metaDescription": _clean_text(
            payload.get("metaDescription")
            or research.get("primary_answer")
            or research.get("current_status_summary")
        ),

        "excerpt": _clean_text(
            payload.get("excerpt")
            or research.get("primary_answer")
            or research.get("current_status_summary")
        ),

        "category": _clean_text(
            payload.get("category")
            or "Wildlife Update"
        ),

        "primaryKeyword": _clean_text(
            payload.get("primaryKeyword")
            or primary_keyword
        ),

        "searchIntent": _clean_text(
            payload.get("searchIntent")
            or research.get("search_intent")
            or "informational"
        ),

        "publishedAt": today,
        "updatedAt": today,
        "lastVerified": today,

        "author": settings.article_author,
        "reviewedBy": settings.article_reviewer,

        "directAnswer": _clean_text(
            payload.get("directAnswer")
            or research.get("primary_answer")
        ),

        "keyFacts": _key_facts(
            payload.get("keyFacts")
        ),

        "sections": _sections(
            payload.get("sections")
        ),

        "faqs": _faqs(
            payload.get("faqs")
        ),

        "sources": research_sources,

        "relatedLinks": related_links,
    }

    _validate_article(article)

    content = (
        json.dumps(
            article,
            ensure_ascii=False,
            indent=2,
        )
        + "\n"
    )

    path = (
        settings.content_dir
        / f"{slug}.json"
    )

    return path, url, content


def update_existing_json(
    llm,
    settings,
    decision: dict,
    candidate,
    research: dict,
    now_local: datetime,
) -> tuple[Path, str, str]:

    path = Path(
        str(
            decision.get(
                "existing_file_path"
            )
            or ""
        )
    )

    if (
        path.suffix.lower() != ".json"
        or not path.exists()
    ):
        raise RuntimeError(
            "Automatic UPDATE/EXPAND is allowed only "
            "for existing src/data/updates/*.json files. "
            "Existing Astro, TypeScript, blog, guide, "
            "or tour pages require manual review."
        )

    article = json.loads(
        path.read_text(
            encoding="utf-8"
        )
    )

    if not isinstance(article, dict):
        raise RuntimeError(
            "Existing update JSON is invalid"
        )

    mode = _clean_text(
        decision.get("action")
        or "EXPAND"
    ).upper()

    precise_angle = _clean_text(
        decision.get("precise_angle")
        or candidate.query
    )

    existing_sections = _sections(
        article.get("sections")
    )

    existing_headings = [
        section["heading"]
        for section in existing_sections
    ]

    prompt = f"""
Prepare ONE precise content patch for an existing
Wild Excursions /updates/ JSON article.

Action:
{mode}

Current trend/query:
{candidate.query}

Precise angle:
{precise_angle}

Current date:
{now_local.strftime('%d %B %Y')}

Existing article:
{json.dumps(article, ensure_ascii=False)}

Research dossier:
{json.dumps(research, ensure_ascii=False)}

Existing section headings:
{json.dumps(existing_headings, ensure_ascii=False)}

Return ONLY:

{{
  "section": {{
    "heading": "one non-duplicate H2 heading",
    "paragraphs": [
      "...",
      "..."
    ]
  }},
  "directAnswer": "revised direct answer only if necessary, otherwise empty string",
  "metaTitle": "revised SEO title only if necessary, without | Wild Excursions, otherwise empty string",
  "metaDescription": "revised description only if necessary, otherwise empty string",
  "newFaqs": [
    {{
      "question": "...",
      "answer": "..."
    }}
  ]
}}

Rules:

- Do not rewrite the whole article.
- Add only one useful section.
- Directly satisfy the newly observed intent.
- Do not duplicate an existing heading.
- Use only verified/current research.
- Never invent safari prices, permits, timings,
  closures, gate status, wildlife sightings,
  statistics, or Wild Excursions claims.
- UPDATE should prioritize current information.
- EXPAND should add a durable narrower answer.
- Add no more than 3 new FAQs.
- No Markdown, HTML, schema, or frontmatter.
"""

    patch = _ensure_object(
        llm.json(prompt)
    )

    new_sections = _sections(
        [patch.get("section")]
    )

    if not new_sections:
        raise RuntimeError(
            "Writer did not return "
            "a usable update section"
        )

    new_heading = (
        new_sections[0]["heading"]
        .strip()
        .lower()
    )

    if any(
        new_heading
        == heading.strip().lower()
        for heading
        in existing_headings
    ):
        raise RuntimeError(
            "Generated section duplicates "
            "an existing update heading"
        )

    if mode == "UPDATE":
        article["sections"] = (
            new_sections
            + existing_sections
        )
    else:
        article["sections"] = (
            existing_sections
            + new_sections
        )

    revised_direct = _clean_text(
        patch.get("directAnswer")
    )

    if revised_direct:
        article["directAnswer"] = (
            revised_direct
        )

    revised_title = _clean_text(
        patch.get("metaTitle")
    )

    if revised_title:
        article["metaTitle"] = (
            revised_title
        )

    revised_description = _clean_text(
        patch.get("metaDescription")
    )

    if revised_description:
        article["metaDescription"] = (
            revised_description
        )

    existing_faqs = _faqs(
        article.get("faqs")
    )

    existing_questions = {
        faq["question"]
        .strip()
        .lower()
        for faq in existing_faqs
    }

    for faq in _faqs(
        patch.get("newFaqs")
    ):
        question_key = (
            faq["question"]
            .strip()
            .lower()
        )

        if question_key not in existing_questions:
            existing_faqs.append(faq)
            existing_questions.add(
                question_key
            )

    article["faqs"] = (
        existing_faqs[:10]
    )

    existing_sources = _normalize_sources(
        article.get("sources") or [],
        limit=20,
    )

    incoming_sources = _normalize_sources(
        research.get("sources") or [],
        limit=10,
    )

    source_urls = {
        source["url"]
        for source
        in existing_sources
    }

    for source in incoming_sources:
        if source["url"] not in source_urls:
            existing_sources.append(source)

            source_urls.add(
                source["url"]
            )

    article["sources"] = (
        existing_sources[:20]
    )

    today = _iso_date(
        now_local
    )

    article["updatedAt"] = today
    article["lastVerified"] = today

    article["draft"] = bool(
        article.get(
            "draft",
            False,
        )
    )

    content = (
        json.dumps(
            article,
            ensure_ascii=False,
            indent=2,
        )
        + "\n"
    )

    url = str(
        decision.get("existing_url")
        or absolute_url(
            settings.site_url,
            settings.route_prefix
            + str(
                article.get("slug")
                or path.stem
            )
            + "/",
        )
    )

    return path, url, content


# Temporary compatibility alias.
# We will update main.py cleanly in the next step.
def update_existing_markdown(
    llm,
    settings,
    decision: dict,
    candidate,
    research: dict,
    now_local: datetime,
):
    return update_existing_json(
        llm,
        settings,
        decision,
        candidate,
        research,
        now_local,
    )