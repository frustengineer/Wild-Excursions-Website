from __future__ import annotations

import json
import re
from urllib.parse import urlparse

import requests


OFFICIAL_HINTS = (
    ".gov.in",
    "ntca.gov.in",
    "mahaforest.gov.in",
    "mpforest.gov.in",
    "mponline.gov.in",
    "moef.gov.in",
    "moefcc.gov.in",
)


CONSEQUENTIAL_TERMS = (
    "booking",
    "permit",
    "price",
    "charge",
    "fee",
    "timing",
    "closure",
    "closed",
    "opening",
    "reopen",
    "rule",
    "gate",
    "zone",
    "cancellation",
    "refund",
    "policy",
)


BAD_AI_PHRASES = (
    "nestled in the heart",
    "in today's fast-paced",
    "in the ever-evolving",
    "whether you're a seasoned",
    "embark on an unforgettable",
    "nature lovers and adventure enthusiasts",
    "breathtaking beauty",
    "hidden gem",
)


def _clean(value) -> str:
    return re.sub(
        r"\s+",
        " ",
        str(value or "").strip(),
    )


def _is_official_source(src: dict) -> bool:
    url = _clean(
        src.get("url")
    ).lower()

    stype = _clean(
        src.get("source_type")
        or src.get("sourceType")
    ).lower()

    publisher = _clean(
        src.get("publisher")
    ).lower()

    if any(
        keyword in stype
        for keyword in (
            "official",
            "government",
            "forest",
            "park authority",
        )
    ):
        return True

    if any(
        keyword in publisher
        for keyword in (
            "government",
            "forest department",
            "ntca",
        )
    ):
        return True

    host = (
        urlparse(url).hostname
        or ""
    ).lower()

    return any(
        hint in host
        for hint in OFFICIAL_HINTS
    )


def _source_reachable(url: str) -> bool:
    if not url.startswith(
        ("http://", "https://")
    ):
        return False

    headers = {
        "User-Agent":
            "Mozilla/5.0 "
            "WildExcursionsFactCheck/1.0"
    }

    try:
        response = requests.head(
            url,
            allow_redirects=True,
            timeout=10,
            headers=headers,
        )

        if response.status_code in {
            403,
            405,
        }:
            response = requests.get(
                url,
                allow_redirects=True,
                timeout=10,
                headers=headers,
                stream=True,
            )

        return (
            200
            <= response.status_code
            < 400
        )

    except Exception:
        return False


def _article_text(article: dict) -> str:
    parts: list[str] = []

    parts.extend([
        _clean(article.get("title")),
        _clean(article.get("excerpt")),
        _clean(article.get("directAnswer")),
    ])

    for fact in (
        article.get("keyFacts")
        or []
    ):
        if not isinstance(fact, dict):
            continue

        parts.append(
            _clean(fact.get("label"))
        )
        parts.append(
            _clean(fact.get("value"))
        )

    for section in (
        article.get("sections")
        or []
    ):
        if not isinstance(
            section,
            dict,
        ):
            continue

        parts.append(
            _clean(
                section.get("heading")
            )
        )

        for paragraph in (
            section.get("paragraphs")
            or []
        ):
            parts.append(
                _clean(paragraph)
            )

    for faq in (
        article.get("faqs")
        or []
    ):
        if not isinstance(
            faq,
            dict,
        ):
            continue

        parts.append(
            _clean(
                faq.get("question")
            )
        )
        parts.append(
            _clean(
                faq.get("answer")
            )
        )

    return " ".join(
        part
        for part in parts
        if part
    )


def _word_count(text: str) -> int:
    return len(
        re.findall(
            r"\b[\w'-]+\b",
            text,
        )
    )


def _valid_sections(
    article: dict,
) -> list[dict]:
    result = []

    for section in (
        article.get("sections")
        or []
    ):
        if not isinstance(
            section,
            dict,
        ):
            continue

        heading = _clean(
            section.get("heading")
        )

        paragraphs = [
            _clean(paragraph)
            for paragraph
            in (
                section.get(
                    "paragraphs"
                )
                or []
            )
            if _clean(paragraph)
        ]

        if heading and paragraphs:
            result.append({
                "heading": heading,
                "paragraphs": paragraphs,
            })

    return result


def _valid_sources(
    article: dict,
) -> list[dict]:
    result = []

    for source in (
        article.get("sources")
        or []
    ):
        if not isinstance(
            source,
            dict,
        ):
            continue

        url = _clean(
            source.get("url")
        )

        if url.startswith(
            ("http://", "https://")
        ):
            result.append(source)

    return result


def audit_generated_content(
    content: str,
    research: dict,
) -> tuple[float, list[str]]:

    issues: list[str] = []

    try:
        article = json.loads(
            content
        )
    except Exception:
        return (
            0,
            ["Invalid article JSON"],
        )

    if not isinstance(
        article,
        dict,
    ):
        return (
            0,
            [
                "Article JSON root "
                "must be an object"
            ],
        )

    title = _clean(
        article.get("title")
    )

    meta_title = _clean(
        article.get("metaTitle")
    )

    desc = _clean(
        article.get(
            "metaDescription"
        )
    )

    direct_answer = _clean(
        article.get(
            "directAnswer"
        )
    )

    sections = _valid_sections(
        article
    )

    sources = _valid_sources(
        article
    )

    full_text = _article_text(
        article
    )

    word_count = _word_count(
        full_text
    )

    verified = [
        fact
        for fact
        in (
            research.get("facts")
            or []
        )
        if (
            isinstance(fact, dict)
            and _clean(
                fact.get("status")
            ).upper()
            == "VERIFIED"
        )
    ]

    uncertain = [
        fact
        for fact
        in (
            research.get("facts")
            or []
        )
        if (
            isinstance(fact, dict)
            and _clean(
                fact.get("status")
            ).upper()
            != "VERIFIED"
        )
    ]

    topic_text = " ".join([
        _clean(
            research.get("topic")
        ),
        _clean(
            research.get(
                "recommended_angle"
            )
        ),
        _clean(
            research.get(
                "current_status_summary"
            )
        ),
        _clean(
            article.get(
                "primaryKeyword"
            )
        ),
        title,
    ]).lower()

    consequential = any(
        term in topic_text
        for term
        in CONSEQUENTIAL_TERMS
    )

    score = 100.0

    # -------------------------
    # Core SEO fields
    # -------------------------

    if (
        not title
        or len(title) < 20
    ):
        issues.append(
            "Title too weak/short"
        )
        score -= 8

    if (
        not meta_title
        or len(meta_title) < 20
    ):
        issues.append(
            "Meta title too weak/short"
        )
        score -= 6

    if (
        "| wild excursions"
        in meta_title.lower()
    ):
        issues.append(
            "Meta title contains brand "
            "suffix already handled by Layout"
        )
        score -= 5

    if (
        not desc
        or len(desc) < 70
    ):
        issues.append(
            "Meta description "
            "too weak/short"
        )
        score -= 6

    if len(desc) > 180:
        issues.append(
            "Meta description unusually long"
        )
        score -= 3

    # -------------------------
    # AEO / GEO structure
    # -------------------------

    if (
        not direct_answer
        or len(direct_answer) < 80
    ):
        issues.append(
            "Quick/direct answer "
            "is missing or too weak"
        )
        score -= 10

    if len(sections) < 3:
        issues.append(
            "Insufficient structured "
            "section coverage"
        )
        score -= 8

    headings = [
        section["heading"].lower()
        for section in sections
    ]

    if (
        len(headings)
        != len(set(headings))
    ):
        issues.append(
            "Duplicate section "
            "headings detected"
        )
        score -= 6

    # -------------------------
    # Content depth
    # -------------------------

    if word_count < 450:
        issues.append(
            "Content may be too thin "
            "for this topic"
        )
        score -= 10

    elif word_count < 650:
        issues.append(
            "Article is relatively short"
        )
        score -= 4

    # -------------------------
    # Sources and verification
    # -------------------------

    if len(sources) < 2:
        issues.append(
            "Fewer than two sources"
        )
        score -= 16

    try:
        source_confidence = float(
            research.get(
                "source_confidence",
                0,
            )
            or 0
        )
    except Exception:
        source_confidence = 0

    if source_confidence < 80:
        issues.append(
            "Research source "
            "confidence below 80"
        )
        score -= 20

    if not verified:
        issues.append(
            "No verified factual claims "
            "in research dossier"
        )
        score -= 12

    if (
        consequential
        and not any(
            _is_official_source(
                source
            )
            for source in sources
        )
    ):
        issues.append(
            "Consequential safari/travel "
            "claim lacks an official/"
            "government source"
        )
        score -= 35

    # -------------------------
    # Source reachability
    # -------------------------

    reachable = 0

    for source in sources[:4]:
        url = _clean(
            source.get("url")
        )

        if _source_reachable(url):
            reachable += 1

    if (
        sources
        and reachable
        < min(
            2,
            len(sources),
        )
    ):
        issues.append(
            "Fewer than two supplied "
            "sources could be reached "
            "during validation"
        )
        score -= 25

    # -------------------------
    # AI-style filler detection
    # -------------------------

    first_part = (
        full_text[:1200]
        .lower()
    )

    if any(
        phrase in first_part
        for phrase in BAD_AI_PHRASES
    ):
        issues.append(
            "Generic AI-style "
            "language detected"
        )
        score -= 8

    # -------------------------
    # Research uncertainty
    # -------------------------

    if len(uncertain) > 5:
        issues.append(
            "Many uncertain/conflicting "
            "claims in research"
        )
        score -= 10

    # -------------------------
    # Required JSON fields
    # -------------------------

    required_fields = (
        "slug",
        "title",
        "metaTitle",
        "metaDescription",
        "publishedAt",
        "updatedAt",
        "lastVerified",
        "directAnswer",
        "sections",
        "sources",
    )

    missing_fields = [
        field
        for field
        in required_fields
        if not article.get(field)
    ]

    if missing_fields:
        issues.append(
            "Missing required JSON fields: "
            + ", ".join(
                missing_fields
            )
        )

        score -= min(
            30,
            5
            * len(
                missing_fields
            ),
        )

    return (
        max(
            0,
            round(
                score,
                2,
            ),
        ),
        issues,
    )