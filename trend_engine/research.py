from __future__ import annotations

import json
from datetime import datetime


def research_topic(llm, candidate, niche: dict, now_local: datetime) -> dict:
    prompt = f"""
Research this topic using LIVE WEB SEARCH for a Wild Excursions article intended to rank in Google Search and be useful to answer/generative search systems.

Topic: {candidate.query}
Date/time context: {now_local.isoformat()}
Business: Wild Excursions, specialist Indian wildlife safari/tour operator.
Niche: {json.dumps(niche, ensure_ascii=False)}

Research requirements:
- Determine what is actually current, not what older pages say.
- Prefer official forest departments, NTCA, government tourism/booking portals, park authorities, recognized conservation/research sources, then reputable news.
- Competitor travel sites may reveal questions/gaps but should not be treated as the primary factual authority when an official source exists.
- Identify what currently ranking/search-visible pages answer and, more importantly, what they fail to answer precisely.
- Never invent prices, timings, permits, wildlife sightings, rules, statistics, dates, resorts, or government policies.
- If a claim cannot be verified, label it unverified and do not recommend publishing it as fact.
- Do not imply Wild Excursions has first-hand observations unless supplied by an existing Wild Excursions page/data source.

Return JSON object with:
topic
why_trending
search_intent
current_status_summary
primary_answer (2-4 sentence precise answer)
query_variants (5-12)
people_questions (3-8)
entities (array)
current_serp_gaps (array)
recommended_angle
source_confidence (0-100)
precision_value (0-100)
commercial_connection (string)
facts: array of {{claim, status: VERIFIED|UNVERIFIED|CONFLICTING, source_urls:[...], source_type, last_checked}}
sources: array of {{title,url,publisher,published_at,source_type,authority_score_0_100}}
unsafe_or_uncertain_claims: array
"""

    result = llm.json(prompt, web=True)

    if not isinstance(result, dict):
        raise ValueError("Research response was not an object")

    return result
