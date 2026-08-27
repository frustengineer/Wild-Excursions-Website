from __future__ import annotations
from datetime import datetime, timezone
import json
import os
from pathlib import Path
from dotenv import load_dotenv

from .config import load_settings
from .db import Database
from .llm import LLM
from .trends import fetch_google_trends_rss, fetch_gsc_emerging
from .discovery import current_web_candidates, merge_candidates, score_candidates_with_llm
from .site_inventory import build_site_inventory, shortlist_pages
from .research import research_topic
from .dedupe import decide_content_action
from .scoring import publication_score
from .writer import generate_new_article, update_existing_json
from .quality import audit_generated_content
from .sitemap import write_trend_sitemap
from .gsc import submit_sitemap_if_enabled, monitor_pending_publications
from .utils import stable_id


def _log(msg: str):
    print(f"[trend-engine] {msg}", flush=True)


def _save_run_artifact(root: Path, name: str, payload):
    out = root / ".trend-engine" / "runs"
    out.mkdir(parents=True, exist_ok=True)
    path = out / name
    path.write_text(json.dumps(payload, ensure_ascii=False, indent=2, default=str), encoding="utf-8")
    return path


def run():
    load_dotenv()
    settings = load_settings()
    now_local = datetime.now(settings.timezone)
    run_key = now_local.strftime("%Y-%m-%d")
    llm = LLM(settings.openai_api_key, settings.openai_model)
    db = Database(settings.supabase_url, settings.supabase_key)

    _log("Monitoring previously published trend URLs for indexing/canonical issues")
    monitor_pending_publications(settings, db)

    _log("Building existing-site topic inventory")
    pages = build_site_inventory(settings)
    _log(f"Indexed {len(pages)} local pages for duplicate/intent checks")

    candidates = []
    _log("Fetching Google Trends Trending Now RSS for India")
    try:
        candidates.extend(fetch_google_trends_rss(settings.geo))
    except Exception as exc:
        _log(f"Google Trends RSS failed: {exc}")

    if settings.enable_gsc_emerging:
        _log("Checking existing Phase-1 Search Console data for emerging site queries")
        candidates.extend(fetch_gsc_emerging(db, settings.gsc_metrics_table))

    if settings.enable_current_web_discovery:
        _log("Using live web research to find niche developments that broad Google Trends may miss")
        try:
            candidates.extend(current_web_candidates(llm, settings.niche))
        except Exception as exc:
            _log(f"Current-web discovery failed: {exc}")

    candidates = merge_candidates(candidates)
    if not candidates:
        raise RuntimeError("No trend candidates discovered")
    _log(f"Discovered {len(candidates)} unique candidate topics")

    scored = score_candidates_with_llm(llm, candidates, settings.niche)
    scored = [c for c in scored if c.niche_relevance >= settings.min_niche_relevance]
    top5 = scored[:5]
    _log("Top 5 qualified topics: " + " | ".join(f"{c.query} ({c.opportunity_score})" for c in top5))

    run_row = {
        "run_date": run_key,
        "started_at": datetime.now(timezone.utc).isoformat(),
        "candidate_count": len(candidates),
        "qualified_count": len(scored),
        "top5": [c.to_dict() for c in top5],
        "status": "researching",
    }
    if db.enabled:
        try:
            db.upsert("trend_runs", run_row, on_conflict="run_date")
        except Exception as exc:
            _log(f"DB run logging warning: {exc}")

    research_results = []
    for rank, candidate in enumerate(top5, start=1):
        _log(f"Researching #{rank}: {candidate.query}")
        candidate.candidate_id = stable_id(run_key + "|" + candidate.query)
        research = research_topic(llm, candidate, settings.niche, now_local)
        decision = decide_content_action(llm, candidate, research, pages)
        pub_score = publication_score(candidate, research, decision)
        row = {
            "rank": rank,
            "candidate": candidate.to_dict(),
            "research": research,
            "decision": decision,
            "publication_score": pub_score,
        }
        research_results.append(row)
        if db.enabled:
            try:
                db.upsert("trend_candidates", {
                    "candidate_key": candidate.candidate_id,
                    "run_date": run_key,
                    "rank": rank,
                    "query": candidate.query,
                    "source": candidate.source,
                    "approx_traffic": candidate.approx_traffic,
                    "growth_signal": candidate.growth_signal,
                    "niche_relevance": candidate.niche_relevance,
                    "business_intent": candidate.business_intent,
                    "opportunity_score": candidate.opportunity_score,
                    "publication_score": pub_score,
                    "decision": decision,
                    "research": research,
                    "status": "researched",
                    "created_at": datetime.now(timezone.utc).isoformat(),
                }, on_conflict="candidate_key")
            except Exception as exc:
                _log(f"DB candidate logging warning: {exc}")

    _save_run_artifact(settings.root, f"{run_key}.json", research_results)

    eligible = []
    for row in research_results:
        c = row["candidate"]
        research = row["research"]
        decision = row["decision"]
        if str(decision.get("action", "IGNORE")).upper() == "IGNORE":
            continue
        if bool(decision.get("manual_review")):
            continue
        if row["publication_score"] < settings.min_publication_score:
            continue
        if float(research.get("source_confidence", 0) or 0) < settings.min_source_confidence:
            continue
        eligible.append(row)

    eligible.sort(key=lambda x: x["publication_score"], reverse=True)
    selected = eligible[: settings.max_daily_publish]
    if not selected:
        _log("No topic passed the publication gate today. Research saved; publishing nothing.")
        if db.enabled:
            try:
                db.upsert("trend_runs", {**run_row, "status": "complete_no_publish", "completed_at": datetime.now(timezone.utc).isoformat()}, on_conflict="run_date")
            except Exception:
                pass
        return

    publications = []
    for row in selected:
        cdict = row["candidate"]
        # Recreate candidate object from the in-memory top5 rather than dict casting.
        candidate = next(c for c in top5 if c.query == cdict["query"])
        research = row["research"]
        decision = row["decision"]
        action = str(decision.get("action")).upper()
        related_pages = shortlist_pages(candidate.query, pages, limit=5)

        _log(f"Preparing {action}: {candidate.query} (publication score {row['publication_score']})")
        if action == "CREATE":
            path, url, content = generate_new_article(llm, settings, candidate, research, related_pages, now_local)
        elif action in {"UPDATE", "EXPAND"} and settings.auto_update_existing_markdown:
            path, url, content = update_existing_json(llm, settings, decision, candidate, research, now_local)
        else:
            _log(f"Skipping unsupported/disabled action {action}")
            continue

        quality_score, issues = audit_generated_content(content, research)
        _log(f"Content quality score: {quality_score}; issues: {issues or 'none'}")
        if quality_score < 85:
            _log("Quality gate failed; not writing site file")
            continue

        draft_dir = settings.root / ".trend-engine" / "drafts"
        draft_dir.mkdir(parents=True, exist_ok=True)
        draft_copy = draft_dir / (path.stem + ".json")
        draft_copy.write_text(content, encoding="utf-8")

        if settings.dry_run:
            _log(f"DRY_RUN: draft saved at {draft_copy}; site not changed")
            status = "draft"
        else:
            path.parent.mkdir(parents=True, exist_ok=True)
            path.write_text(content, encoding="utf-8")
            _log(f"Wrote site content: {path}")
            if settings.publish_mode == "direct":
                status = "updated" if action in {"UPDATE", "EXPAND"} else "published"
            else:
                # In PR mode the file is prepared but not production-live yet.
                status = "draft"

        pub = {
            "candidate_key": candidate.candidate_id,
            "query": candidate.query,
            "action": action,
            "url": url,
            "file_path": str(path),
            "publication_score": row["publication_score"],
            "quality_score": quality_score,
            "status": status,
            "published_at": datetime.now(timezone.utc).isoformat(),
            "updated_at": datetime.now(timezone.utc).isoformat(),
            "issues": issues,
        }
        publications.append(pub)
        if db.enabled:
            try:
                db.insert("trend_publications", pub)
            except Exception as exc:
                _log(f"DB publication logging warning: {exc}")

    if (
        publications
        and not settings.dry_run
        and settings.publish_mode == "direct"
    ):
        path = write_trend_sitemap(settings, db)
        if path:
            _log(f"Updated trend sitemap: {path}")
        try:
            submit_sitemap_if_enabled(settings)
            _log("Search Console sitemap registration/submission completed")
        except Exception as exc:
            _log(f"Sitemap API warning: {exc}")

    if db.enabled:
        try:
            db.upsert("trend_runs", {
                **run_row,
                "status": "complete",
                "selected": publications,
                "completed_at": datetime.now(timezone.utc).isoformat(),
            }, on_conflict="run_date")
        except Exception:
            pass

    _log(f"Run complete. Published/updated {len(publications)} page(s).")


if __name__ == "__main__":
    run()
