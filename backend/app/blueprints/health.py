from flask import Blueprint, jsonify
import requests
from config import Config
from app.services.supabase_service import get_supabase_admin

health_bp = Blueprint("health", __name__)

@health_bp.route("/health", methods=["GET"])
def health_check():
    """
    Health check endpoint: Actually pings Supabase DB REST API to confirm connection status.
    """
    supabase_status = "disconnected"
    try:
        # Ping Supabase REST API directly or execute admin health ping
        headers = {
            "apikey": Config.SUPABASE_SERVICE_ROLE_KEY,
            "Authorization": f"Bearer {Config.SUPABASE_SERVICE_ROLE_KEY}"
        }
        res = requests.get(f"{Config.SUPABASE_URL}/rest/v1/", headers=headers, timeout=5)
        if res.status_code < 500:
            supabase_status = "connected"
    except Exception as e:
        supabase_status = f"error: {str(e)}"

    status_code = 200 if supabase_status == "connected" else 503
    return jsonify({
        "status": "ok" if supabase_status == "connected" else "degraded",
        "supabase": supabase_status
    }), status_code
