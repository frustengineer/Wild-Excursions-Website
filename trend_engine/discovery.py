from __future__ import annotations

import json

from .models import TrendCandidate
from .scoring import opportunity_score
from .utils import normalize_query


def _extract_candidate_rows(data) -> list[dict]:
    """Accept the small set of wrapper keys an LLM may reasonably return."""
    if isinstance(data, list):
        return [row for row in data if isinstance(row, dict)]

    if not isinstance(data, dict):
        return []

    for key in (
        "candidates",
        "items",
        "topics",
        "results",
        "opportunities",
        "data",
    ):
        value = data.get(key)
        if isinstance(value, list):
            return [row for row in value if isinstance(row, dict)]

    # A single candidate object is still better than throwing useful work away.
    if data.get("query"):
        return [data]

    return []


def _first_source_url(value) -> str | None:
    if not isinstance(value, list) or not value:
        return None

    first = value[0]
    if isinstance(first, str):
        return first
    if isinstance(first, dict):
        url = first.get("url") or first.get("link")
        return str(url) if url else None
    return None


def current_web_candidates(llm, niche: dict) -> list[TrendCandidate]:
    """
    Use one live-web pass only when cheaper sources/site-gap discovery cannot
    produce a relevant opportunity. The response is deliberately a JSON object,
    matching the DeepSeek JSON helper used by this project.
    """
    parks = ", ".join(niche.get("parks", []))
    species = ", ".join(niche.get("species", []))
    focus = ", ".join(niche.get("business_focus", []))

    prompt = f"""
Use live web search to identify CURRENT or rapidly developing search-interest
opportunities in India from roughly the last 48 hours to 7 days for a specialist
wildlife travel company.

Business focus: {focus}
Priority parks: {parks}
Species/entities: {species}

Find up to 8 strong candidate topics that a real traveller, wildlife enthusiast,
photographer, or safari buyer could plausibly be searching now. Favor:
- park opening/closure/booking/permit/gate/zone changes
- weather or access changes that affect safari travel
- notable official wildlife/conservation updates with travel relevance
- genuinely rising safari planning questions
- current tiger reserve or national park developments

Reject generic celebrity, politics, cricket, finance, astrology, or viral topics
with no meaningful wildlife-travel value.
Do not claim exact Google search volume unless a source provides it.
Keep the result concise.

Return exactly one JSON object in this shape:
{{
  "candidates": [
    {{
      "query": "...",
      "why_current": "...",
      "freshness_score_0_100": 0,
      "estimated_travel_relevance_0_100": 0,
      "sources": ["https://..."]
    }}
  ]
}}
"""

    data = llm.json(prompt, web=True)
    rows = _extract_candidate_rows(data)

    out: list[TrendCandidate] = []
    for item in rows[:8]:
        q = str(item.get("query") or "").strip()
        if not q:
            continue

        out.append(
            TrendCandidate(
                query=q,
                source="current_web_research",
                source_url=_first_source_url(item.get("sources")),
                trend_velocity=55,
                freshness=float(item.get("freshness_score_0_100") or 70),
                niche_relevance=float(
                    item.get("estimated_travel_relevance_0_100") or 60
                ),
                reason=str(item.get("why_current") or ""),
            )
        )

    return out


def site_gap_candidates(
    llm,
    niche: dict,
    pages,
    limit: int = 10,
) -> list[TrendCandidate]:
    """
    Cheap fallback discovery that does NOT use live web search.

    It looks at the site's existing topic inventory and proposes missing,
    durable safari-planning opportunities. The winning topic is still sent
    through live research later before anything can publish.
    """
    limit = max(1, min(12, int(limit)))

    existing = []
    for page in pages[:180]:
        existing.append(
            {
                "title": page.title,
                "primary_keyword": page.primary_keyword,
                "search_intent": page.search_intent,
                "url": page.url,
            }
        )

    prompt = f"""
You are finding the best missing SEO opportunities for Wild Excursions, a
specialist Indian wildlife safari company.

Niche configuration:
{json.dumps(niche, ensure_ascii=False)}

Existing site topic inventory (compact):
{json.dumps(existing, ensure_ascii=False)}

Propose up to {limit} HIGHLY RELEVANT missing or under-covered search intents.
These are fallback opportunities for days when broad Google Trends is irrelevant.
They should be useful to a person planning, comparing, booking, or preparing for
an Indian jungle safari and should strengthen Wild Excursions' topical authority.

Prefer durable topics such as:
- safari booking and permit planning
- best zones/gates and how travellers should choose between them
- park-to-park comparisons with a real decision intent
- seasonal planning and month-specific safari questions
- first-time safari planning, logistics, photography, families, groups
- park-specific travel questions that deserve precise answers

Do NOT propose a topic already clearly covered by an existing URL.
Do NOT invent current facts. Current facts will be verified in a separate live
research stage before publishing.
Do NOT propose generic wildlife facts with little travel value.

Return exactly one JSON object:
{{
  "candidates": [
    {{
      "query": "exact search-style topic",
      "why_useful": "short reason",
      "estimated_travel_relevance_0_100": 0,
      "estimated_business_intent_0_100": 0,
      "longevity_0_100": 0,
      "unique_value_0_100": 0
    }}
  ]
}}
"""

    data = llm.json(prompt)
    rows = _extract_candidate_rows(data)

    out: list[TrendCandidate] = []
    for item in rows[:limit]:
        q = str(item.get("query") or "").strip()
        if not q:
            continue

        out.append(
            TrendCandidate(
                query=q,
                source="site_gap_fallback",
                trend_velocity=45,
                freshness=60,
                niche_relevance=float(
                    item.get("estimated_travel_relevance_0_100") or 75
                ),
                business_intent=float(
                    item.get("estimated_business_intent_0_100") or 70
                ),
                longevity=float(item.get("longevity_0_100") or 80),
                unique_value=float(item.get("unique_value_0_100") or 75),
                reason=str(item.get("why_useful") or ""),
            )
        )

    return out


def merge_candidates(candidates: list[TrendCandidate]) -> list[TrendCandidate]:
    merged: dict[str, TrendCandidate] = {}

    for c in candidates:
        key = normalize_query(c.query)
        if not key:
            continue

        if key not in merged:
            merged[key] = c
            continue

        existing = merged[key]
        existing.trend_velocity = max(existing.trend_velocity, c.trend_velocity)
        existing.freshness = max(existing.freshness, c.freshness)
        existing.niche_relevance = max(existing.niche_relevance, c.niche_relevance)
        existing.business_intent = max(existing.business_intent, c.business_intent)
        existing.longevity = max(existing.longevity, c.longevity)
        existing.unique_value = max(existing.unique_value, c.unique_value)
        existing.approx_traffic = (
            max(existing.approx_traffic or 0, c.approx_traffic or 0) or None
        )
        existing.reason = (existing.reason + " | " + c.reason).strip(" |")
        existing.source += "+" + c.source

    return list(merged.values())


def score_candidates_with_llm(
    llm,
    candidates: list[TrendCandidate],
    niche: dict,
) -> list[TrendCandidate]:
    # Bound candidate scoring so discovery stays cheap. Deep research happens
    # later only for the very best 1-2 opportunities.
    candidates = sorted(
        candidates,
        key=lambda c: (c.trend_velocity, c.freshness),
        reverse=True,
    )[:40]

    payload = [
        {
            "query": c.query,
            "source": c.source,
            "approx_traffic": c.approx_traffic,
            "growth_signal": c.growth_signal,
            "trend_velocity": c.trend_velocity,
            "freshness": c.freshness,
            "niche_relevance_hint": c.niche_relevance,
            "business_intent_hint": c.business_intent,
            "longevity_hint": c.longevity,
            "unique_value_hint": c.unique_value,
            "reason": c.reason,
        }
        for c in candidates
    ]

    prompt = f"""
You are ranking daily content opportunities for Wild Excursions, a specialist
Indian wildlife safari company.

Niche configuration:
{json.dumps(niche, ensure_ascii=False)}

Candidate topics:
{json.dumps(payload, ensure_ascii=False)}

For each candidate return scores 0-100 for:
- niche_relevance: direct usefulness to Indian wildlife/safari travellers
- business_intent: likelihood the topic helps a traveller choose/plan/book a
  safari or strengthens commercial topical authority
- longevity: usefulness after the immediate news cycle
- unique_value: ability for a specialist operator to add precise practical value
  beyond summarizing generic information
- freshness: preserve/enhance the supplied freshness using the topic context
Also return a short reason of no more than 20 words.

Do NOT inflate unrelated viral trends. A highly searched general topic can still
score near zero for this business.

Return exactly one JSON object:
{{
  "candidates": [
    {{
      "query": "preserve the query exactly",
      "niche_relevance": 0,
      "business_intent": 0,
      "longevity": 0,
      "unique_value": 0,
      "freshness": 0,
      "reason": "..."
    }}
  ]
}}
"""

    data = llm.json(prompt)
    rows = _extract_candidate_rows(data)

    by_query = {
        normalize_query(str(x.get("query") or "")): x
        for x in rows
        if isinstance(x, dict)
    }

    for c in candidates:
        row = by_query.get(normalize_query(c.query), {})
        c.niche_relevance = max(
            c.niche_relevance,
            float(row.get("niche_relevance") or 0),
        )
        c.business_intent = max(
            c.business_intent,
            float(row.get("business_intent") or 0),
        )
        c.longevity = max(c.longevity, float(row.get("longevity") or 0))
        c.unique_value = max(c.unique_value, float(row.get("unique_value") or 0))
        c.freshness = max(c.freshness, float(row.get("freshness") or 0))
        c.reason = str(row.get("reason") or c.reason)
        c.opportunity_score = opportunity_score(c)

    return sorted(candidates, key=lambda c: c.opportunity_score, reverse=True)
