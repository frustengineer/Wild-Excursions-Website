from __future__ import annotations

import json
from pathlib import Path

from .site_inventory import shortlist_pages


def _is_safe_update_json(path_value: str | None) -> bool:
    if not path_value:
        return False

    try:
        path = Path(str(path_value))
    except Exception:
        return False

    normalized = str(path).replace("\\", "/").lower()

    return (
        path.suffix.lower() == ".json"
        and "/src/data/updates/" in "/" + normalized.lstrip("/")
    )


def decide_content_action(
    llm,
    candidate,
    research: dict,
    pages,
) -> dict:
    shortlist = shortlist_pages(
        candidate.query,
        pages,
        limit=15,
    )

    page_payload = [
        page.to_dict()
        for page in shortlist
    ]

    prompt = f"""
Decide whether today's trend should CREATE a new Wild Excursions URL,
UPDATE an existing page, EXPAND an existing page with a precise new
section, or IGNORE it.

Trend:
{candidate.query}

Trend/research summary:
{json.dumps(research, ensure_ascii=False)}

Potentially related existing pages:
{json.dumps(page_payload, ensure_ascii=False)}

Hard rules:

1. NEW TREND does NOT mean NEW PAGE.
2. Same search intent -> UPDATE/EXPAND the strongest existing page,
   not a new URL.
3. Different wording of the same question is not a new intent.
4. CREATE only when the intent is meaningfully distinct, useful,
   supportable by trustworthy current sources, and deserves its own
   durable URL.
5. IGNORE when an existing page already answers the intent well or the
   trend is weak/noisy.
6. Automatic UPDATE/EXPAND is allowed ONLY when existing_file_path is
   a local src/data/updates/*.json file.
7. If the best matching page is Astro, Markdown, MDX, TypeScript,
   LIVE_SITEMAP, a tour, guide, blog or another legacy page:
   - do not rewrite it automatically;
   - set manual_review=true for UPDATE/EXPAND;
   - do not create a duplicate page with the same intent.
8. High cannibalization risk must never auto-publish.

Return one JSON object:

action: CREATE|UPDATE|EXPAND|IGNORE
existing_url: string|null
existing_file_path: string|null
same_intent_score: 0-100
distinct_intent_score: 0-100
cannibalization_risk: 0-100
manual_review: boolean
reason: concise
precise_angle: exact narrower angle to cover
suggested_primary_keyword: string
"""

    result = llm.json(prompt)

    if not isinstance(result, dict):
        raise ValueError(
            "Dedupe decision was not an object"
        )

    action = str(
        result.get("action")
        or "IGNORE"
    ).upper()

    if action not in {
        "CREATE",
        "UPDATE",
        "EXPAND",
        "IGNORE",
    }:
        result["action"] = "IGNORE"
        result["manual_review"] = True
        result["reason"] = (
            "Invalid dedupe action returned; forced to IGNORE."
        )
        return result

    result["action"] = action

    if action in {"UPDATE", "EXPAND"}:
        if not _is_safe_update_json(
            result.get("existing_file_path")
        ):
            result["manual_review"] = True
            result["reason"] = (
                str(result.get("reason") or "")
                + " Automatic editing blocked because the matched "
                  "page is not a local src/data/updates/*.json file."
            ).strip()

    try:
        cannibalization_risk = float(
            result.get("cannibalization_risk")
            or 0
        )
    except Exception:
        cannibalization_risk = 100.0

    if (
        action == "CREATE"
        and cannibalization_risk >= 75
    ):
        result["manual_review"] = True
        result["reason"] = (
            str(result.get("reason") or "")
            + " High cannibalization risk requires manual review."
        ).strip()

    return result