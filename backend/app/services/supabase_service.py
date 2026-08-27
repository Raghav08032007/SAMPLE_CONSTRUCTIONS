"""
Supabase Admin Service.
Provides a singleton instance of Supabase Client using the Service Role Key for backend administrative operations.
"""

from supabase import create_client, Client
from config import Config

_supabase_admin_client: Client = None

def get_supabase_admin() -> Client:
    global _supabase_admin_client
    if _supabase_admin_client is None:
        if not Config.SUPABASE_URL or not Config.SUPABASE_SERVICE_ROLE_KEY:
            raise ValueError("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be configured.")
        _supabase_admin_client = create_client(Config.SUPABASE_URL, Config.SUPABASE_SERVICE_ROLE_KEY)
    return _supabase_admin_client
