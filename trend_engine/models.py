from __future__ import annotations
from dataclasses import dataclass, field, asdict
from typing import Any


@dataclass
class TrendCandidate:
    query: str
    source: str
    source_url: str | None = None
    approx_traffic: int | None = None
    growth_signal: float | None = None
    published_at: str | None = None
    related_news: list[dict[str, Any]] = field(default_factory=list)
    niche_relevance: float = 0
    business_intent: float = 0
    longevity: float = 0
    unique_value: float = 0
    freshness: float = 0
    trend_velocity: float = 0
    opportunity_score: float = 0
    reason: str = ""
    candidate_id: str | None = None

    def to_dict(self):
        return asdict(self)


@dataclass
class SitePage:
    file_path: str
    url: str
    title: str
    description: str = ""
    body_excerpt: str = ""
    search_intent: str = ""
    primary_keyword: str = ""
    file_type: str = ""

    def to_dict(self):
        return asdict(self)
