from flask import Blueprint, jsonify

uploads_bp = Blueprint("uploads", __name__)

@uploads_bp.route("/status", methods=["GET"])
def upload_status():
    return jsonify({"status": "ready"}), 200
