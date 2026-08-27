from __future__ import annotations
import base64
import json
import os
from dataclasses import dataclass
from pathlib import Path
from zoneinfo import ZoneInfo
import yaml


def env_bool(name: str, default: bool) -> bool:
    value = os.getenv(name)
    if value is None:
        return default
    return value.strip().lower() in {"1", "true", "yes", "on"}


def first_env(*names: str, default: str | None = None) -> str | None:
    for name in names:
        value = os.getenv(name)
        if value:
            return value
    return default


def load_service_account_json() -> dict | None:
    raw = first_env(
        "GSC_SERVICE_ACCOUNT_JSON",
        "GOOGLE_SERVICE_ACCOUNT_JSON",
        "GOOGLE_CREDENTIALS_JSON",
        "GSC_CREDENTIALS",
    )
    if not raw:
        return None
    raw = raw.strip()
    if raw.startswith("{"):
        return json.loads(raw)
    try:
        decoded = base64.b64decode(raw).decode("utf-8")
        return json.loads(decoded)
    except Exception as exc:
        raise ValueError("GSC service-account secret is neither JSON nor base64 JSON") from exc


@dataclass(frozen=True)
class Settings:
    root: Path
    openai_api_key: str
    openai_model: str
    site_url: str
    content_dir: Path
    pages_dir: Path
    route_prefix: str
    geo: str
    timezone: ZoneInfo
    max_daily_publish: int
    min_publication_score: float
    min_niche_relevance: float
    min_source_confidence: float
    publish_mode: str
    renderer_adds_h1: bool
    article_author: str
    article_reviewer: str
    supabase_url: str | None
    supabase_key: str | None
    gsc_metrics_table: str
    gsc_site_url: str
    gsc_credentials: dict | None
    trend_sitemap_path: Path
    trend_sitemap_url: str
    trend_sitemap_auto_submit: bool
    enable_gsc_emerging: bool
    enable_current_web_discovery: bool
    auto_add_related_links: bool
    auto_update_existing_markdown: bool
    dry_run: bool
    niche: dict


def load_settings(root: str | Path | None = None) -> Settings:
    root_path = Path(root or os.getcwd()).resolve()
    niche_path = root_path / "config" / "niche.yml"
    if not niche_path.exists():
        # Allows running from a parent site repo with the engine nested in automation/trend-engine.
        niche_path = Path(__file__).resolve().parents[1] / "config" / "niche.yml"
    niche = yaml.safe_load(niche_path.read_text(encoding="utf-8"))

    api_key = os.getenv("OPENAI_API_KEY", "")
    if not api_key:
        raise RuntimeError("OPENAI_API_KEY is required")

    site_url = os.getenv("SITE_URL", "https://wildexcursions.in").rstrip("/")
    content_dir = Path(os.getenv("SITE_CONTENT_DIR", "src/content/blogs"))
    pages_dir = Path(os.getenv("SITE_PAGES_DIR", "src/pages"))
    sitemap_path = Path(os.getenv("TREND_SITEMAP_PATH", "public/trend-sitemap.xml"))

    return Settings(
        root=root_path,
        openai_api_key=api_key,
        openai_model=os.getenv("OPENAI_MODEL", "gpt-5"),
        site_url=site_url,
        content_dir=(root_path / content_dir).resolve(),
        pages_dir=(root_path / pages_dir).resolve(),
        route_prefix="/" + os.getenv("SITE_ROUTE_PREFIX", "/blogs/").strip("/") + "/",
        geo=os.getenv("TREND_GEO", "IN"),
        timezone=ZoneInfo(os.getenv("TREND_TIMEZONE", "Asia/Kolkata")),
        max_daily_publish=max(0, int(os.getenv("MAX_DAILY_PUBLISH", "1"))),
        min_publication_score=float(os.getenv("TREND_MIN_PUBLICATION_SCORE", "85")),
        min_niche_relevance=float(os.getenv("TREND_MIN_NICHE_RELEVANCE", "70")),
        min_source_confidence=float(os.getenv("TREND_MIN_SOURCE_CONFIDENCE", "80")),
        publish_mode=os.getenv("TREND_PUBLISH_MODE", "pr").lower(),
        renderer_adds_h1=env_bool("CONTENT_RENDERER_ADDS_H1", True),
        article_author=os.getenv("ARTICLE_AUTHOR", "Wild Excursions Editorial Team"),
        article_reviewer=os.getenv("ARTICLE_REVIEWER", "Wild Excursions Operations Team"),
        supabase_url=os.getenv("SUPABASE_URL"),
        supabase_key=first_env("SUPABASE_SERVICE_ROLE_KEY", "SUPABASE_KEY", "SUPABASE_ANON_KEY"),
        gsc_metrics_table=os.getenv("GSC_METRICS_TABLE", "seo_daily_metrics"),
        gsc_site_url=os.getenv("GSC_SITE_URL", site_url + "/"),
        gsc_credentials=load_service_account_json(),
        trend_sitemap_path=(root_path / sitemap_path).resolve(),
        trend_sitemap_url=os.getenv("TREND_SITEMAP_URL", site_url + "/trend-sitemap.xml"),
        trend_sitemap_auto_submit=env_bool("TREND_SITEMAP_AUTO_SUBMIT", True),
        enable_gsc_emerging=env_bool("ENABLE_GSC_EMERGING", True),
        enable_current_web_discovery=env_bool("ENABLE_CURRENT_WEB_DISCOVERY", True),
        auto_add_related_links=env_bool("AUTO_ADD_RELATED_LINKS", True),
        auto_update_existing_markdown=env_bool("AUTO_UPDATE_EXISTING_MARKDOWN", True),
        dry_run=env_bool("DRY_RUN", False),
        niche=niche,
    )
