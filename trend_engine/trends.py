from __future__ import annotations
from datetime import datetime, timedelta, timezone
import xml.etree.ElementTree as ET
import requests
from .models import TrendCandidate
from .utils import parse_approx_traffic, traffic_score, normalize_query

HT_NS = "https://trends.google.com/trending/rss"


def fetch_google_trends_rss(geo: str = "IN") -> list[TrendCandidate]:
    url = f"https://trends.google.com/trending/rss?geo={geo}"
    r = requests.get(url, timeout=30, headers={"User-Agent": "Mozilla/5.0 WildExcursionsTrendBot/1.0"})
    r.raise_for_status()
    root = ET.fromstring(r.content)
    candidates: list[TrendCandidate] = []
    for item in root.findall("./channel/item"):
        title = (item.findtext("title") or "").strip()
        if not title:
            continue
        traffic_text = item.findtext(f"{{{HT_NS}}}approx_traffic")
        traffic = parse_approx_traffic(traffic_text)
        pub_date = (item.findtext("pubDate") or "").strip() or None
        news = []
        for n in item.findall(f"{{{HT_NS}}}news_item"):
            news.append({
                "title": n.findtext(f"{{{HT_NS}}}news_item_title") or "",
                "url": n.findtext(f"{{{HT_NS}}}news_item_url") or "",
                "source": n.findtext(f"{{{HT_NS}}}news_item_source") or "",
            })
        candidates.append(TrendCandidate(
            query=title,
            source="google_trends_rss",
            source_url=url,
            approx_traffic=traffic,
            published_at=pub_date,
            related_news=news,
            trend_velocity=traffic_score(traffic),
            freshness=90,
        ))
    return candidates


def fetch_gsc_emerging(db, table: str) -> list[TrendCandidate]:
    if not db.enabled:
        return []
    now = datetime.now(timezone.utc)
    start = (now - timedelta(days=35)).date().isoformat()
    try:
        result = db.client.table(table).select("date,query,impressions,clicks,position,page").gte("date", start).execute()
        rows = result.data or []
    except Exception:
        return []

    latest_cut = (now - timedelta(days=9)).date().isoformat()  # GSC data can lag.
    previous_cut = (now - timedelta(days=30)).date().isoformat()
    agg: dict[str, dict] = {}
    for row in rows:
        q = normalize_query(str(row.get("query") or ""))
        if not q:
            continue
        bucket = agg.setdefault(q, {"display": row.get("query") or q, "latest": 0.0, "previous": 0.0})
        date = str(row.get("date") or "")
        imp = float(row.get("impressions") or 0)
        if date >= latest_cut:
            bucket["latest"] += imp
        elif date >= previous_cut:
            bucket["previous"] += imp

    out = []
    for q, data in agg.items():
        weekly_prev = data["previous"] / 3.0 if data["previous"] else 0
        growth = (data["latest"] + 1) / (weekly_prev + 1)
        if data["latest"] >= 10 and growth >= 1.5:
            score = min(100.0, 55 + min(growth, 6) * 7)
            out.append(TrendCandidate(
                query=str(data["display"]),
                source="gsc_emerging",
                growth_signal=round(growth, 2),
                trend_velocity=score,
                freshness=70,
            ))
    return sorted(out, key=lambda x: x.trend_velocity, reverse=True)[:40]
