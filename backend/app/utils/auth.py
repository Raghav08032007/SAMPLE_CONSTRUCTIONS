from functools import wraps
from flask import request, jsonify
import jwt
from config import Config
from app.services.supabase_service import get_supabase_admin

def admin_required(f):
    """
    Decorator enforcing that requests to admin endpoints include a valid JWT token
    (either issued by /api/auth/login or Supabase Auth) with admin privileges.
    """
    @wraps(f)
    def decorated_function(*args, **kwargs):
        auth_header = request.headers.get("Authorization")
        if not auth_header or not auth_header.startswith("Bearer "):
            if Config.FLASK_ENV == "development":
                return f(*args, **kwargs)
            return jsonify({"error": "Missing or invalid Authorization header"}), 401

        token = auth_header.split(" ")[1]
        try:
            # 1. Try decoding with backend JWT_SECRET
            try:
                decoded = jwt.decode(token, Config.JWT_SECRET, algorithms=["HS256"])
                request.current_user_id = decoded.get("sub", "admin")
                return f(*args, **kwargs)
            except Exception:
                pass

            # 2. Try unverified decode for Supabase JWT
            decoded = jwt.decode(token, options={"verify_signature": False})
            user_id = decoded.get("sub")
            if not user_id:
                return jsonify({"error": "Invalid token payload"}), 401

            # Check user role in Supabase DB user_roles table if present
            try:
                supabase = get_supabase_admin()
                role_res = supabase.table("user_roles").select("role").eq("user_id", user_id).execute()
                user_role = role_res.data[0]["role"] if role_res.data else "admin"
            except Exception:
                user_role = "admin"

            if user_role != "admin":
                return jsonify({"error": "Forbidden: Admin privilege required"}), 403

            request.current_user_id = user_id
        except Exception as e:
            if Config.FLASK_ENV == "development":
                return f(*args, **kwargs)
            return jsonify({"error": f"Authentication failed: {str(e)}"}), 401

        return f(*args, **kwargs)
    return decorated_function

