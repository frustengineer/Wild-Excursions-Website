from __future__ import annotations
from datetime import datetime, timezone
from pathlib import Path
import xml.etree.ElementTree as ET


def write_trend_sitemap(settings, db) -> Path | None:
    if not db.enabled:
        return None
    try:
        rows = db.client.table("trend_publications").select("url,published_at,updated_at,status").in_("status", ["published", "updated"]).execute().data or []
    except Exception:
        return None
    by_url = {}
    for row in rows:
        url = row.get("url")
        if not url:
            continue
        stamp = row.get("updated_at") or row.get("published_at") or datetime.now(timezone.utc).isoformat()
        if url not in by_url or stamp > by_url[url]:
            by_url[url] = stamp
    ns = "http://www.sitemaps.org/schemas/sitemap/0.9"
    ET.register_namespace("", ns)
    root = ET.Element(f"{{{ns}}}urlset")
    for url, stamp in sorted(by_url.items()):
        node = ET.SubElement(root, f"{{{ns}}}url")
        ET.SubElement(node, f"{{{ns}}}loc").text = url
        ET.SubElement(node, f"{{{ns}}}lastmod").text = stamp
    settings.trend_sitemap_path.parent.mkdir(parents=True, exist_ok=True)
    ET.ElementTree(root).write(settings.trend_sitemap_path, encoding="utf-8", xml_declaration=True)
    return settings.trend_sitemap_path
