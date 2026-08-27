from __future__ import annotations
import json
from .models import TrendCandidate
from .scoring import opportunity_score
from .utils import normalize_query


def current_web_candidates(llm, niche: dict) -> list[TrendCandidate]:
    parks = ", ".join(niche.get("parks", []))
    species = ", ".join(niche.get("species", []))
    focus = ", ".join(niche.get("business_focus", []))
    prompt = f"""
Use live web search to identify CURRENT or rapidly developing search-interest opportunities in India from roughly the last 48 hours to 7 days for a specialist wildlife travel company.

Business focus: {focus}
Priority parks: {parks}
Species/entities: {species}

Find up to 25 candidate topics that a real traveller, wildlife enthusiast, photographer, or safari buyer could plausibly be searching now. Favor:
- park opening/closure/booking/permit/gate/zone changes
- weather or access changes that affect safari travel
- notable official wildlife/conservation updates with travel relevance
- genuinely rising safari planning questions
- current tiger reserve or national park developments

Reject generic celebrity, politics, cricket, or viral topics with no meaningful wildlife-travel value.
Do not claim exact Google search volume unless a source provides it.

Return JSON array objects:
query, why_current, freshness_score_0_100, estimated_travel_relevance_0_100, sources (array of URLs).
"""
    data = llm.json(prompt, web=True)
    if isinstance(data, dict):
        data = data.get("items") or data.get("candidates") or []
    out = []
    for item in data[:25]:
        q = str(item.get("query") or "").strip()
        if not q:
            continue
        out.append(TrendCandidate(
            query=q,
            source="current_web_research",
            source_url=(item.get("sources") or [None])[0],
            trend_velocity=55,
            freshness=float(item.get("freshness_score_0_100") or 70),
            niche_relevance=float(item.get("estimated_travel_relevance_0_100") or 60),
            reason=str(item.get("why_current") or ""),
        ))
    return out


def merge_candidates(candidates: list[TrendCandidate]) -> list[TrendCandidate]:
    merged: dict[str, TrendCandidate] = {}
    for c in candidates:
        key = normalize_query(c.query)
        if not key:
            continue
        if key not in merged:
            merged[key] = c
        else:
            existing = merged[key]
            existing.trend_velocity = max(existing.trend_velocity, c.trend_velocity)
            existing.freshness = max(existing.freshness, c.freshness)
            existing.niche_relevance = max(existing.niche_relevance, c.niche_relevance)
            existing.approx_traffic = max(existing.approx_traffic or 0, c.approx_traffic or 0) or None
            existing.reason = (existing.reason + " | " + c.reason).strip(" |")
            existing.source += "+" + c.source
    return list(merged.values())


def score_candidates_with_llm(llm, candidates: list[TrendCandidate], niche: dict) -> list[TrendCandidate]:
    # Keep the call bounded while allowing broad discovery.
    candidates = sorted(candidates, key=lambda c: (c.trend_velocity, c.freshness), reverse=True)[:100]
    payload = [{
        "query": c.query,
        "source": c.source,
        "approx_traffic": c.approx_traffic,
        "growth_signal": c.growth_signal,
        "trend_velocity": c.trend_velocity,
        "freshness": c.freshness,
        "reason": c.reason,
    } for c in candidates]
    prompt = f"""
You are ranking daily content opportunities for Wild Excursions, a specialist Indian wildlife safari company.

Niche configuration:
{json.dumps(niche, ensure_ascii=False)}

Candidate topics:
{json.dumps(payload, ensure_ascii=False)}

For each candidate return scores 0-100 for:
- niche_relevance: direct usefulness to Indian wildlife/safari travellers
- business_intent: likelihood the topic helps a traveller choose/plan/book a safari or strengthens commercial topical authority
- longevity: usefulness after the immediate news cycle
- unique_value: ability for a specialist operator to add precise practical value beyond summarizing news
- freshness: preserve/enhance the supplied freshness using the topic context
Also return a short reason.

Do NOT inflate unrelated viral trends. A highly searched general topic can still score near zero for this business.
Return an array, preserving query exactly.
"""
    data = llm.json(prompt)
    if isinstance(data, dict):
        data = data.get("items") or data.get("candidates") or []
    by_query = {normalize_query(str(x.get("query") or "")): x for x in data}
    for c in candidates:
        row = by_query.get(normalize_query(c.query), {})
        c.niche_relevance = max(c.niche_relevance, float(row.get("niche_relevance") or 0))
        c.business_intent = float(row.get("business_intent") or 0)
        c.longevity = float(row.get("longevity") or 0)
        c.unique_value = float(row.get("unique_value") or 0)
        c.freshness = max(c.freshness, float(row.get("freshness") or 0))
        c.reason = str(row.get("reason") or c.reason)
        c.opportunity_score = opportunity_score(c)
    return sorted(candidates, key=lambda c: c.opportunity_score, reverse=True)
