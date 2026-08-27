from __future__ import annotations
import hashlib
import json
import math
import re
from pathlib import Path
from urllib.parse import urljoin


def slugify(value: str) -> str:
    value = value.lower().strip()
    value = re.sub(r"[^a-z0-9\s-]", "", value)
    value = re.sub(r"[\s_-]+", "-", value)
    return value.strip("-")[:90]


def normalize_query(value: str) -> str:
    return re.sub(r"\s+", " ", re.sub(r"[^a-z0-9\s]", " ", value.lower())).strip()


def stable_id(value: str) -> str:
    return hashlib.sha256(value.encode("utf-8")).hexdigest()[:24]


def parse_approx_traffic(value: str | None) -> int | None:
    if not value:
        return None
    cleaned = value.upper().replace(",", "").replace("+", "").strip()
    m = re.match(r"([0-9.]+)\s*([KMB]?)", cleaned)
    if not m:
        return None
    num = float(m.group(1))
    mult = {"": 1, "K": 1_000, "M": 1_000_000, "B": 1_000_000_000}[m.group(2)]
    return int(num * mult)


def traffic_score(traffic: int | None) -> float:
    if not traffic:
        return 45.0
    # 100 -> 40, 1k -> 60, 10k -> 80, 100k+ -> 100
    return max(20.0, min(100.0, 20.0 * math.log10(max(traffic, 10))))


def safe_json(text: str):
    text = text.strip()
    text = re.sub(r"^```(?:json)?\s*", "", text)
    text = re.sub(r"\s*```$", "", text)
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        start_obj, end_obj = text.find("{"), text.rfind("}")
        start_arr, end_arr = text.find("["), text.rfind("]")
        options = []
        if start_obj >= 0 and end_obj > start_obj:
            options.append(text[start_obj:end_obj+1])
        if start_arr >= 0 and end_arr > start_arr:
            options.append(text[start_arr:end_arr+1])
        for option in options:
            try:
                return json.loads(option)
            except json.JSONDecodeError:
                pass
        raise


def absolute_url(site_url: str, path: str) -> str:
    if path.startswith("http://") or path.startswith("https://"):
        return path
    return urljoin(site_url.rstrip("/") + "/", path.lstrip("/"))


def read_text_safe(path: Path, max_chars: int = 30_000) -> str:
    try:
        return path.read_text(encoding="utf-8", errors="ignore")[:max_chars]
    except Exception:
        return ""
