from __future__ import annotations
from .models import TrendCandidate


def opportunity_score(c: TrendCandidate) -> float:
    score = (
        0.25 * c.trend_velocity
        + 0.20 * c.niche_relevance
        + 0.15 * c.business_intent
        + 0.10 * c.longevity
        + 0.15 * c.unique_value
        + 0.15 * c.freshness
    )
    return round(max(0, min(100, score)), 2)


def publication_score(candidate: TrendCandidate, research: dict, decision: dict) -> float:
    source_conf = float(research.get("source_confidence", 0) or 0)
    precision = float(research.get("precision_value", 0) or 0)
    distinct = float(decision.get("distinct_intent_score", 0) or 0)
    action = str(decision.get("action", "IGNORE")).upper()
    if action in {"UPDATE", "EXPAND"}:
        # Same-intent updates are desirable; don't punish them for not being a new intent.
        distinct = max(distinct, 80)
    score = (
        0.20 * candidate.opportunity_score
        + 0.20 * candidate.niche_relevance
        + 0.15 * candidate.business_intent
        + 0.15 * source_conf
        + 0.15 * candidate.unique_value
        + 0.10 * precision
        + 0.05 * distinct
    )
    return round(max(0, min(100, score)), 2)
