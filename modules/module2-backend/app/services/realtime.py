"""
realtime.py – Supabase Realtime broadcast wrapper.

When Supabase is configured the update is published to the named channel so
that Module 1 (frontend) and Module 5 (dashboard) receive live updates without
polling.  When Supabase is not configured (local dev / tests) the call is a
no-op with a console log.
"""

from ..core.database import get_db


def broadcast_update(channel: str, payload: dict) -> None:
    """
    Broadcast a realtime event to all subscribers of `channel`.
    Falls back to a console print when Supabase is not configured.
    """
    db = get_db()
    if db is None:
        print(f"[realtime] (no-op) channel={channel} payload={payload}")
        return

    try:
        # Supabase Python client v2 supports realtime channel broadcast
        db.channel(channel).send(
            type="broadcast",
            event="update",
            payload=payload,
        )
    except Exception as exc:
        # Never crash the main request over a realtime delivery failure
        print(f"[realtime] broadcast failed on channel={channel}: {exc}")
