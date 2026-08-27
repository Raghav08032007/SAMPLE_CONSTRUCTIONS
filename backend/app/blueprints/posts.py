from flask import Blueprint, jsonify, request
from app.services.supabase_service import get_supabase_admin

posts_bp = Blueprint("posts", __name__)

@posts_bp.route("", methods=["GET"])
def list_posts():
    try:
        supabase = get_supabase_admin()
        res = supabase.table("posts").select("*").eq("status", "published").order("published_at", desc=True).execute()
        return jsonify({"posts": res.data}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@posts_bp.route("/<slug>", methods=["GET"])
def get_post_by_slug(slug):
    try:
        supabase = get_supabase_admin()
        res = supabase.table("posts").select("*").eq("slug", slug).eq("status", "published").execute()
        if not res.data:
            return jsonify({"error": "Post not found"}), 404
        return jsonify(res.data[0]), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
