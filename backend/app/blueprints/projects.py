from flask import Blueprint, jsonify, request
from app.services.data_store import data_store

projects_bp = Blueprint("projects", __name__)

@projects_bp.route("", methods=["GET"])
def get_public_projects():
    category = request.args.get("category")
    featured = request.args.get("featured")
    projects = data_store.get_public_projects(category=category, featured=featured)
    return jsonify({"projects": projects}), 200

@projects_bp.route("/<slug>", methods=["GET"])
def get_project_by_slug(slug):
    project = data_store.get_project_by_id_or_slug(slug, is_slug=True)
    if not project:
        return jsonify({"error": "Project not found"}), 404

    # Linked testimonial
    testimonials = data_store.get_testimonials(approved_only=True)
    testimonial = next((t for t in testimonials if t.get("project_id") == project.get("id")), None)
    project["testimonial"] = testimonial

    # Similar projects
    all_pub = data_store.get_public_projects(category=project.get("category"))
    project["similar_projects"] = [p for p in all_pub if p.get("id") != project.get("id")][:3]

    return jsonify(project), 200
