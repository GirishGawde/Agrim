from supabase import create_client, Client
from ..config import settings

_client: Client | None = None


def get_db() -> Client:
    """
    Returns a Supabase client singleton.
    Falls back to a mock-friendly None when SUPABASE_URL is not configured
    (e.g. during local dev / unit tests).
    """
    global _client
    if _client is None:
        if settings.supabase_url and settings.supabase_key:
            _client = create_client(settings.supabase_url, settings.supabase_key)
    return _client
