import datetime
from flask import Blueprint, jsonify, request
import jwt
from config import Config

auth_bp = Blueprint("auth", __name__)

DEFAULT_ADMIN_USER = "admin"
DEFAULT_ADMIN_EMAIL = "admin@srmhomes.com"
DEFAULT_ADMIN_PASS = "SRMHomes2026Admin!"

@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json() or {}
    username_or_email = (data.get("username") or data.get("email") or "").strip().lower()
    password = data.get("password") or ""

    if not username_or_email or not password:
        return jsonify({"error": "Username/email and password are required."}), 400

    # Validate against administrator credentials
    if (username_or_email in [DEFAULT_ADMIN_USER, DEFAULT_ADMIN_EMAIL]) and (password == DEFAULT_ADMIN_PASS):
        payload = {
            "sub": "admin-srm-homes-001",
            "username": DEFAULT_ADMIN_USER,
            "email": DEFAULT_ADMIN_EMAIL,
            "role": "admin",
            "exp": datetime.datetime.utcnow() + datetime.timedelta(days=7)
        }
        token = jwt.encode(payload, Config.JWT_SECRET, algorithm="HS256")
        if isinstance(token, bytes):
            token = token.decode("utf-8")

        return jsonify({
            "success": True,
            "token": token,
            "user": {
                "username": DEFAULT_ADMIN_USER,
                "email": DEFAULT_ADMIN_EMAIL,
                "role": "admin",
                "name": "SRM Homes Administrator"
            }
        }), 200

    return jsonify({"error": "Invalid username or password. Please check your credentials."}), 401


@auth_bp.route("/verify", methods=["GET"])
def verify_session():
    auth_header = request.headers.get("Authorization")
    if auth_header and auth_header.startswith("Bearer "):
        token = auth_header.split(" ")[1]
        try:
            decoded = jwt.decode(token, Config.JWT_SECRET, algorithms=["HS256"])
            return jsonify({
                "authenticated": True,
                "user": {
                    "username": decoded.get("username", DEFAULT_ADMIN_USER),
                    "email": decoded.get("email", DEFAULT_ADMIN_EMAIL),
                    "role": decoded.get("role", "admin")
                }
            }), 200
        except Exception:
            pass

    return jsonify({"authenticated": False, "message": "Auth session unverified"}), 200

