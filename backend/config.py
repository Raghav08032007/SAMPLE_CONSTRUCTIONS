import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    """
    Centralized configuration management for SRM Homes Flask Backend.
    Enforces required environment variable presence.
    """
    SUPABASE_URL = os.getenv("SUPABASE_URL", "")
    SUPABASE_SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "")
    JWT_SECRET = os.getenv("JWT_SECRET", "srm_homes_jwt_secret_key_2026_super_secure")
    FLASK_ENV = os.getenv("FLASK_ENV", "development")
    PORT = int(os.getenv("PORT", 5000))
    CORS_ORIGINS = [
        origin.strip() for origin in os.getenv(
            "CORS_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173"
        ).split(",") if origin.strip()
    ]
