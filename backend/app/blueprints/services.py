from flask import Blueprint, jsonify, request
from app.utils.auth import admin_required
from app.services.data_store import data_store

services_bp = Blueprint("services", __name__)

# 1. PUBLIC GET ALL SERVICES
@services_bp.route("", methods=["GET"])
@services_bp.route("/", methods=["GET"])
def get_services():
    published_only = request.args.get("admin") != "true"
    services = data_store.get_all_services(published_only=published_only)
    return jsonify({"services": services}), 200

# 2. GET SINGLE SERVICE DETAILS
@services_bp.route("/<identifier>", methods=["GET"])
def get_service_detail(identifier):
    service = data_store.get_service_by_id_or_slug(identifier)
    if not service:
        return jsonify({"error": "Service not found"}), 404
    return jsonify(service), 200

# 3. CREATE SERVICE (ADMIN)
@services_bp.route("", methods=["POST"])
@services_bp.route("/", methods=["POST"])
@admin_required
def create_service():
    data = request.get_json() or {}
    title = data.get("title")
    if not title:
        return jsonify({"error": "Service title is required"}), 400

    created = data_store.create_service(data)
    return jsonify(created), 201

# 4. UPDATE SERVICE (ADMIN)
@services_bp.route("/<service_id>", methods=["PUT"])
@admin_required
def update_service(service_id):
    data = request.get_json() or {}
    updated = data_store.update_service(service_id, data)
    if not updated:
        return jsonify({"error": "Service not found"}), 404
    return jsonify(updated), 200

# 5. DELETE SERVICE (ADMIN)
@services_bp.route("/<service_id>", methods=["DELETE"])
@admin_required
def delete_service(service_id):
    deleted = data_store.delete_service(service_id)
    return jsonify({"message": "Service deleted successfully", "success": deleted}), 200
