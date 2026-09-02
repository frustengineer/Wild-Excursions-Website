from __future__ import annotations

from datetime import datetime, timezone
import json
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
    path.write_text(
        json.dumps(payload, ensure_ascii=False, indent=2, default=str),
        encoding="utf-8",
    )
    return path


def _save_latest_summary(root: Path, payload: dict):
    out = root / ".trend-engine"
    out.mkdir(parents=True, exist_ok=True)
    path = out / "latest-summary.json"
    path.write_text(
        json.dumps(payload, ensure_ascii=False, indent=2, default=str),
        encoding="utf-8",
    )
    return path


def _candidate_line(candidate) -> str:
    return (
        f"{candidate.query} | opportunity={candidate.opportunity_score:.2f} "
        f"niche={candidate.niche_relevance:.1f} "
        f"business={candidate.business_intent:.1f} "
        f"freshness={candidate.freshness:.1f}"
    )


def _gate_reasons(row: dict, settings, fallback: bool = False) -> list[str]:
    candidate = row["candidate"]
    research = row["research"]
    decision = row["decision"]

    action = str(decision.get("action", "IGNORE")).upper()
    manual_review = bool(decision.get("manual_review"))
    pub_score = float(row["publication_score"] or 0)
    source_conf = float(research.get("source_confidence", 0) or 0)
    niche = float(candidate.get("niche_relevance", 0) or 0)
    cannibalization = float(decision.get("cannibalization_risk", 0) or 0)

    if fallback:
        min_pub = settings.fallback_min_publication_score
        min_source = settings.fallback_min_source_confidence
        min_niche = settings.fallback_min_niche_relevance
    else:
        min_pub = settings.min_publication_score
        min_source = settings.min_source_confidence
        min_niche = settings.min_niche_relevance

    reasons: list[str] = []

    if action == "IGNORE":
        reasons.append("action=IGNORE")
    if manual_review:
        reasons.append("manual_review=true")
    if pub_score < min_pub:
        reasons.append(f"publication_score {pub_score:.2f} < {min_pub:.2f}")
    if source_conf < min_source:
        reasons.append(f"source_confidence {source_conf:.2f} < {min_source:.2f}")
    if niche < min_niche:
        reasons.append(f"niche_relevance {niche:.2f} < {min_niche:.2f}")
    if cannibalization >= 75:
        reasons.append(f"cannibalization_risk {cannibalization:.2f} >= 75")

    return reasons


def _is_eligible(row: dict, settings, fallback: bool = False) -> bool:
    return not _gate_reasons(row, settings, fallback=fallback)


def _score_candidates(candidates, llm, settings):
    if not candidates:
        return []

    scored = score_candidates_with_llm(llm, candidates, settings.niche)

    _log("Candidate scoring results:")
    for candidate in scored[:10]:
        _log("  " + _candidate_line(candidate))

    return scored


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

    # ------------------------------------------------------------------
    # Stage 1: cheap discovery first. No live DeepSeek web research yet.
    # ------------------------------------------------------------------
    cheap_candidates = []

    _log("Fetching Google Trends Trending Now RSS for India")
    try:
        cheap_candidates.extend(fetch_google_trends_rss(settings.geo))
    except Exception as exc:
        _log(f"Google Trends RSS failed: {exc}")

    if settings.enable_gsc_emerging:
        _log("Checking existing Search Console data for emerging site queries")
        cheap_candidates.extend(fetch_gsc_emerging(db, settings.gsc_metrics_table))

    cheap_candidates = merge_candidates(cheap_candidates)
    _log(f"Cheap discovery found {len(cheap_candidates)} unique candidate topics")

    scored = _score_candidates(cheap_candidates, llm, settings)

    # ------------------------------------------------------------------
    # Stage 2: only pay for live web discovery when cheap sources do not
    # produce at least one decent niche candidate.
    # ------------------------------------------------------------------
    has_viable_cheap_candidate = any(
        c.niche_relevance >= settings.fallback_min_niche_relevance
        for c in scored[:10]
    )

    if settings.enable_current_web_discovery and not has_viable_cheap_candidate:
        _log(
            "No sufficiently relevant cheap candidate found; "
            "running one live web discovery pass"
        )
        try:
            web_candidates = current_web_candidates(llm, settings.niche)
            combined = merge_candidates(cheap_candidates + web_candidates)
            scored = _score_candidates(combined, llm, settings)
        except Exception as exc:
            _log(f"Current-web discovery failed: {exc}")

    if not scored:
        raise RuntimeError("No trend candidates discovered or scored")

    strict_ranked = [
        c for c in scored
        if c.niche_relevance >= settings.min_niche_relevance
    ]
    fallback_ranked = [
        c for c in scored
        if c.niche_relevance >= settings.fallback_min_niche_relevance
    ]

    # Research at most 1-2 candidates. This is the expensive part.
    research_pool = fallback_ranked[: settings.max_research_candidates]

    _log(
        "Research pool: "
        + (
            " | ".join(_candidate_line(c) for c in research_pool)
            if research_pool
            else "none"
        )
    )

    run_row = {
        "run_date": run_key,
        "started_at": datetime.now(timezone.utc).isoformat(),
        "candidate_count": len(scored),
        "qualified_count": len(strict_ranked),
        "fallback_qualified_count": len(fallback_ranked),
        "top5": [c.to_dict() for c in scored[:5]],
        "status": "researching",
    }

    if db.enabled:
        try:
            db.upsert("trend_runs", run_row, on_conflict="run_date")
        except Exception as exc:
            _log(f"DB run logging warning: {exc}")

    if not research_pool:
        summary = {
            "run_date": run_key,
            "status": "complete_no_publish",
            "reason": "No candidate met even the fallback niche-relevance gate.",
            "published": [],
        }
        _save_latest_summary(settings.root, summary)
        _log(summary["reason"])
        return

    research_results = []

    for rank, candidate in enumerate(research_pool, start=1):
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

        strict_reasons = _gate_reasons(row, settings, fallback=False)
        fallback_reasons = _gate_reasons(row, settings, fallback=True)

        _log(
            f"Result #{rank}: action={str(decision.get('action', 'IGNORE')).upper()} "
            f"publication_score={pub_score:.2f} "
            f"source_confidence={float(research.get('source_confidence', 0) or 0):.2f}"
        )
        _log(
            "  strict gate: "
            + ("PASS" if not strict_reasons else "REJECTED - " + "; ".join(strict_reasons))
        )
        _log(
            "  fallback gate: "
            + (
                "PASS"
                if not fallback_reasons
                else "REJECTED - " + "; ".join(fallback_reasons)
            )
        )

        if db.enabled:
            try:
                db.upsert(
                    "trend_candidates",
                    {
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
                    },
                    on_conflict="candidate_key",
                )
            except Exception as exc:
                _log(f"DB candidate logging warning: {exc}")

        # If the first researched topic passes the strict gate, stop spending tokens.
        if _is_eligible(row, settings, fallback=False):
            _log("Strict publication winner found; stopping additional deep research")
            break

    _save_run_artifact(settings.root, f"{run_key}.json", research_results)

    strict_eligible = [
        row for row in research_results
        if _is_eligible(row, settings, fallback=False)
    ]
    fallback_eligible = [
        row for row in research_results
        if _is_eligible(row, settings, fallback=True)
    ]

    strict_eligible.sort(key=lambda x: x["publication_score"], reverse=True)
    fallback_eligible.sort(key=lambda x: x["publication_score"], reverse=True)

    # Prefer strict winners. If none exist, use the best safe fallback.
    ordered_candidates = strict_eligible[:]
    for row in fallback_eligible:
        if row not in ordered_candidates:
            ordered_candidates.append(row)

    if not ordered_candidates:
        summary = {
            "run_date": run_key,
            "status": "complete_no_publish",
            "reason": "No researched topic passed the strict or safe fallback publication gates.",
            "researched": [
                {
                    "query": row["candidate"]["query"],
                    "publication_score": row["publication_score"],
                    "action": row["decision"].get("action"),
                    "strict_rejection": _gate_reasons(row, settings, fallback=False),
                    "fallback_rejection": _gate_reasons(row, settings, fallback=True),
                }
                for row in research_results
            ],
            "published": [],
        }
        _save_latest_summary(settings.root, summary)
        _log(summary["reason"])

        if db.enabled:
            try:
                db.upsert(
                    "trend_runs",
                    {
                        **run_row,
                        "status": "complete_no_publish",
                        "completed_at": datetime.now(timezone.utc).isoformat(),
                    },
                    on_conflict="run_date",
                )
            except Exception:
                pass
        return

    publications = []

    # Try the best eligible candidate first. If its generated article fails the
    # content-quality audit, try the second already-researched candidate without
    # doing another web-research pass.
    for row in ordered_candidates:
        if len(publications) >= settings.max_daily_publish:
            break

        cdict = row["candidate"]
        candidate = next(c for c in research_pool if c.query == cdict["query"])
        research = row["research"]
        decision = row["decision"]
        action = str(decision.get("action")).upper()
        related_pages = shortlist_pages(candidate.query, pages, limit=5)

        gate_mode = "strict" if row in strict_eligible else "fallback"
        _log(
            f"Preparing {action}: {candidate.query} "
            f"(publication score {row['publication_score']}; gate={gate_mode})"
        )

        if action == "CREATE":
            path, url, content = generate_new_article(
                llm,
                settings,
                candidate,
                research,
                related_pages,
                now_local,
            )
        elif action in {"UPDATE", "EXPAND"} and settings.auto_update_existing_markdown:
            path, url, content = update_existing_json(
                llm,
                settings,
                decision,
                candidate,
                research,
                now_local,
            )
        else:
            _log(f"Skipping unsupported/disabled action {action}")
            continue

        quality_score, issues = audit_generated_content(content, research)
        _log(f"Content quality score: {quality_score}; issues: {issues or 'none'}")

        if quality_score < settings.min_quality_score:
            _log(
                f"Quality gate failed ({quality_score} < {settings.min_quality_score}); "
                "trying next eligible researched candidate if available"
            )
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
                status = "draft"

        pub = {
            "candidate_key": candidate.candidate_id,
            "query": candidate.query,
            "action": action,
            "gate_mode": gate_mode,
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

    if publications and not settings.dry_run and settings.publish_mode == "direct":
        path = write_trend_sitemap(settings, db)
        if path:
            _log(f"Updated trend sitemap: {path}")
        try:
            submit_sitemap_if_enabled(settings)
            _log("Search Console sitemap registration/submission completed")
        except Exception as exc:
            _log(f"Sitemap API warning: {exc}")

    final_status = "complete" if publications else "complete_no_publish"
    summary = {
        "run_date": run_key,
        "status": final_status,
        "daily_target": 1,
        "published": publications,
        "researched": [
            {
                "query": row["candidate"]["query"],
                "publication_score": row["publication_score"],
                "action": row["decision"].get("action"),
            }
            for row in research_results
        ],
    }
    _save_latest_summary(settings.root, summary)

    if db.enabled:
        try:
            db.upsert(
                "trend_runs",
                {
                    **run_row,
                    "status": final_status,
                    "selected": publications,
                    "completed_at": datetime.now(timezone.utc).isoformat(),
                },
                on_conflict="run_date",
            )
        except Exception:
            pass

    if publications:
        for pub in publications:
            _log(
                f"Selected daily SEO update: {pub['action']} | {pub['query']} | {pub['url']}"
            )
    else:
        _log("No page passed the final content-quality gate; publishing nothing for safety")

    _log(f"Run complete. Published/updated {len(publications)} page(s).")


if __name__ == "__main__":
    run()
