import uuid
import csv
import io
from flask import Blueprint, jsonify, request, Response
from app.utils.auth import admin_required
from app.services.data_store import data_store, slugify
from config import Config

import urllib.request
import urllib.parse
import re

admin_bp = Blueprint("admin", __name__)

# MAP LINK RESOLVER ENDPOINT (Expands maps.app.goo.gl short links & extracts GPS coordinates)
@admin_bp.route("/projects/resolve-map-url", methods=["POST"])
@admin_required
def admin_resolve_map_url():
    data = request.get_json() or {}
    raw_url = data.get("url", "").strip()

    if not raw_url:
        return jsonify({"error": "No URL provided"}), 400

    # Extract src from iframe snippet if user pasted full <iframe src="...">
    iframe_match = re.search(r'src=["\']([^"\']+)["\']', raw_url)
    clean_url = iframe_match.group(1) if iframe_match else raw_url

    resolved_url = clean_url
    lat, lng = None, None

    # Follow HTTP redirects for maps.app.goo.gl short links
    if "maps.app.goo.gl" in clean_url or "goo.gl/maps" in clean_url or clean_url.startswith("http"):
        try:
            req = urllib.request.Request(
                clean_url,
                headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'}
            )
            with urllib.request.urlopen(req, timeout=5) as response:
                resolved_url = response.geturl()
        except Exception as e:
            print("Map URL expansion note:", e)

    # Extract coordinates @lat,lng
    coord_match = re.search(r'@(-?\d+\.\d+),(-?\d+\.\d+)', resolved_url)
    if not coord_match:
        coord_match = re.search(r'[?&](?:q|ll)=(-?\d+\.\d+),(-?\d+\.\d+)', resolved_url)

    if coord_match:
        lat = float(coord_match.group(1))
        lng = float(coord_match.group(2))

    # Construct iframe embed URL
    if lat and lng:
        embed_url = f"https://maps.google.com/maps?q={lat},{lng}&z=15&output=embed"
    elif "output=embed" in resolved_url or "maps/embed" in resolved_url:
        embed_url = resolved_url
    else:
        embed_url = f"https://maps.google.com/maps?q={urllib.parse.quote(resolved_url)}&z=15&output=embed"

    return jsonify({
        "original_url": raw_url,
        "resolved_url": resolved_url,
        "embed_url": embed_url,
        "lat": lat,
        "lng": lng
    }), 200

# 1. ADMIN PROJECTS LIST
@admin_bp.route("/projects", methods=["GET"])
@admin_required
def admin_list_projects():

    projects = data_store.get_all_admin_projects()
    for p in projects:
        p["image_count"] = len(p.get("project_images", []))
    return jsonify({"projects": projects}), 200

# 2. CREATE PROJECT DRAFT
@admin_bp.route("/projects", methods=["POST"])
@admin_required
def admin_create_project():
    data = request.get_json() or {}
    title = data.get("title")
    if not title:
        return jsonify({"error": "Title is required"}), 400

    created = data_store.create_project(data)
    return jsonify(created), 201

# 3. GET PROJECT DETAILS
@admin_bp.route("/projects/<project_id>", methods=["GET"])
@admin_required
def admin_get_project(project_id):
    project = data_store.get_project_by_id_or_slug(project_id, is_slug=False)
    if not project:
        return jsonify({"error": "Project not found"}), 404
    return jsonify(project), 200

# 4. UPDATE PROJECT (ENFORCE NO ZERO-IMAGE PUBLISHING)
@admin_bp.route("/projects/<project_id>", methods=["PUT"])
@admin_required
def admin_update_project(project_id):
    data = request.get_json() or {}
    project = data_store.get_project_by_id_or_slug(project_id, is_slug=False)

    # Enforce Rule: Can't publish a project with 0 images
    if data.get("status") == "published":
        imgs = project.get("project_images", []) if project else []
        if len(imgs) == 0:
            return jsonify({"error": "Cannot publish a project with zero images. Please upload at least one photo or add an image URL first."}), 400

    updated = data_store.update_project(project_id, data)
    return jsonify(updated), 200

# 5. DELETE PROJECT
@admin_bp.route("/projects/<project_id>", methods=["DELETE"])
@admin_required
def admin_delete_project(project_id):
    data_store.delete_project(project_id)
    return jsonify({"message": "Project deleted successfully"}), 200

# 6. UPLOAD OR ADD PROJECT IMAGE
@admin_bp.route("/projects/<project_id>/images", methods=["POST"])
@admin_required
def admin_upload_project_image(project_id):
    # Case A: JSON Payload with direct image_url
    if request.is_json:
        data = request.get_json() or {}
        image_url = data.get("image_url")
        image_type = data.get("image_type", "gallery")
        if not image_url:
            return jsonify({"error": "image_url is required"}), 400

        added_img = data_store.add_project_image(project_id, image_url, image_type)
        return jsonify(added_img), 201

    # Case B: Multipart File Upload
    if 'file' not in request.files:
        return jsonify({"error": "No image file or URL provided"}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No file selected"}), 400

    # Read uploaded file bytes and encode as base64 Data URL so the exact uploaded photo is preserved
    ext = file.filename.rsplit('.', 1)[-1].lower() if '.' in file.filename else 'jpg'
    if ext == 'jpg':
        ext = 'jpeg'
    file_bytes = file.read()
    import base64
    b64_str = base64.b64encode(file_bytes).decode('utf-8')
    public_url = f"data:image/{ext};base64,{b64_str}"
    image_type = request.form.get("image_type", "gallery")

    added_img = data_store.add_project_image(project_id, public_url, image_type)
    return jsonify(added_img), 201

# 7. DELETE SINGLE IMAGE
@admin_bp.route("/projects/<project_id>/images/<image_id>", methods=["DELETE"])
@admin_required
def admin_delete_image(project_id, image_id):
    data_store.delete_project_image(project_id, image_id)
    return jsonify({"message": "Image deleted successfully"}), 200

# 8. ATOMIC SET COVER IMAGE
@admin_bp.route("/projects/<project_id>/images/<image_id>/set-cover", methods=["PUT"])
@admin_required
def admin_set_cover_image(project_id, image_id):
    data_store.set_cover_image(project_id, image_id)
    return jsonify({"message": "Cover image updated"}), 200

# 9. TESTIMONIAL MODERATION
@admin_bp.route("/testimonials", methods=["GET"])
@admin_required
def admin_list_testimonials():
    testimonials = data_store.get_testimonials(approved_only=False)
    return jsonify({"testimonials": testimonials}), 200

@admin_bp.route("/testimonials/<testimonial_id>", methods=["PUT"])
@admin_required
def admin_update_testimonial(testimonial_id):
    data = request.get_json() or {}
    updated = data_store.update_testimonial(testimonial_id, data)
    return jsonify(updated), 200

# 10. LEADS MANAGEMENT & CSV EXPORT
@admin_bp.route("/leads", methods=["GET"])
@admin_required
def admin_list_leads():
    leads = data_store.get_leads()
    return jsonify({"leads": leads}), 200

@admin_bp.route("/leads/<lead_id>", methods=["PUT"])
@admin_required
def admin_update_lead(lead_id):
    data = request.get_json() or {}
    updated = data_store.update_lead(lead_id, data)
    return jsonify(updated), 200

@admin_bp.route("/leads/export", methods=["GET"])
@admin_required
def admin_export_leads_csv():
    leads = data_store.get_leads()
    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(["ID", "Name", "Phone", "Email", "Location", "Project Type", "Plot Size", "Budget Range", "Status", "Created At", "Message"])

    for l in leads:
        writer.writerow([
            l.get("id"), l.get("name"), l.get("phone"), l.get("email"),
            l.get("location"), l.get("project_type"), l.get("plot_size"),
            l.get("budget_range"), l.get("status"), l.get("created_at"), l.get("message")
        ])

    return Response(
        output.getvalue(),
        mimetype="text/csv",
        headers={"Content-Disposition": "attachment; filename=srm_homes_leads.csv"}
    )
