from supabase import create_client, Client
from config import get_settings
from functools import lru_cache

settings = get_settings()


@lru_cache()
def get_supabase_client() -> Client:
    """Get Supabase client singleton"""
    return create_client(
        supabase_url=settings.supabase_url,
        supabase_key=settings.supabase_anon_key
    )


# Convenience function
def get_db() -> Client:
    """Get database client"""
    return get_supabase_client()
