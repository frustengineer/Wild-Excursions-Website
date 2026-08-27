from __future__ import annotations
from datetime import datetime, timedelta, timezone
import requests
from bs4 import BeautifulSoup
from google.oauth2 import service_account
from googleapiclient.discovery import build

SCOPES = ["https://www.googleapis.com/auth/webmasters"]


def _service(settings):
    if not settings.gsc_credentials:
        return None
    creds = service_account.Credentials.from_service_account_info(settings.gsc_credentials, scopes=SCOPES)
    return build("searchconsole", "v1", credentials=creds, cache_discovery=False)


def submit_sitemap_if_enabled(settings):
    if not settings.trend_sitemap_auto_submit:
        return None
    service = _service(settings)
    if not service:
        return None
    return service.sitemaps().submit(siteUrl=settings.gsc_site_url, feedpath=settings.trend_sitemap_url).execute()


def inspect_url(settings, url: str) -> dict | None:
    service = _service(settings)
    if not service:
        return None
    body = {"inspectionUrl": url, "siteUrl": settings.gsc_site_url, "languageCode": "en-US"}
    return service.urlInspection().index().inspect(body=body).execute()


def live_seo_check(url: str) -> dict:
    try:
        r = requests.get(url, timeout=20, headers={"User-Agent": "Mozilla/5.0 WildExcursionsSEOCheck/1.0"})
        result = {"status_code": r.status_code, "ok": r.ok}
        if not r.ok:
            return result
        soup = BeautifulSoup(r.text, "html.parser")
        robots = soup.find("meta", attrs={"name": lambda x: x and x.lower() == "robots"})
        canonical = soup.find("link", attrs={"rel": lambda x: x and "canonical" in x if isinstance(x, list) else x == "canonical"})
        h1s = soup.find_all("h1")
        result.update({
            "noindex": bool(robots and "noindex" in str(robots.get("content", "")).lower()),
            "canonical": canonical.get("href") if canonical else None,
            "h1_count": len(h1s),
            "title": soup.title.get_text(" ", strip=True) if soup.title else None,
        })
        return result
    except Exception as exc:
        return {"ok": False, "error": str(exc)}


def monitor_pending_publications(settings, db):
    if not db.enabled or not settings.gsc_credentials:
        return []
    now = datetime.now(timezone.utc)
    try:
        pubs = db.client.table("trend_publications").select("id,url,published_at,status").in_("status", ["published", "updated"]).execute().data or []
    except Exception:
        return []
    results = []
    for pub in pubs:
        try:
            published = datetime.fromisoformat(str(pub["published_at"]).replace("Z", "+00:00"))
        except Exception:
            continue
        age_days = (now - published).days
        if age_days not in {1, 3, 7, 14}:
            continue
        try:
            inspection = inspect_url(settings, pub["url"]) or {}
            idx = inspection.get("inspectionResult", {}).get("indexStatusResult", {})
            live = live_seo_check(pub["url"])
            row = {
                "publication_id": pub["id"],
                "url": pub["url"],
                "checked_at": now.isoformat(),
                "age_days": age_days,
                "verdict": idx.get("verdict"),
                "coverage_state": idx.get("coverageState"),
                "robots_txt_state": idx.get("robotsTxtState"),
                "indexing_state": idx.get("indexingState"),
                "last_crawl_time": idx.get("lastCrawlTime"),
                "google_canonical": idx.get("googleCanonical"),
                "user_canonical": idx.get("userCanonical"),
                "live_check": live,
            }
            db.insert("trend_index_checks", row)
            results.append(row)
        except Exception as exc:
            results.append({"url": pub["url"], "error": str(exc)})
    return results
