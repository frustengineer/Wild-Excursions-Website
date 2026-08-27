from __future__ import annotations
from datetime import datetime, timezone
from typing import Any


class Database:
    def __init__(self, url: str | None, key: str | None):
        self.client = None
        if url and key:
            from supabase import create_client
            self.client = create_client(url, key)

    @property
    def enabled(self) -> bool:
        return self.client is not None

    def upsert(self, table: str, row: dict[str, Any], on_conflict: str | None = None):
        if not self.client:
            return None
        q = self.client.table(table).upsert(row, on_conflict=on_conflict) if on_conflict else self.client.table(table).upsert(row)
        return q.execute()

    def insert(self, table: str, row: dict[str, Any]):
        if not self.client:
            return None
        return self.client.table(table).insert(row).execute()

    def select(self, table: str, columns: str = "*", **filters):
        if not self.client:
            return []
        q = self.client.table(table).select(columns)
        for key, value in filters.items():
            q = q.eq(key, value)
        result = q.execute()
        return result.data or []

    def recent_publications(self, days: int = 120):
        if not self.client:
            return []
        cutoff = datetime.now(timezone.utc).timestamp() - days * 86400
        cutoff_iso = datetime.fromtimestamp(cutoff, tz=timezone.utc).isoformat()
        try:
            result = self.client.table("trend_publications").select("*").gte("published_at", cutoff_iso).execute()
            return result.data or []
        except Exception:
            return []
