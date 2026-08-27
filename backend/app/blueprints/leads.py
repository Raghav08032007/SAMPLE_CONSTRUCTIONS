from flask import Blueprint, jsonify, request
from pydantic import ValidationError
from app.models.schemas import LeadCreateSchema
from app.services.data_store import data_store

leads_bp = Blueprint("leads", __name__)

@leads_bp.route("", methods=["POST"])
def submit_lead():
    try:
        data = request.get_json() or {}
        payload = LeadCreateSchema(**data)
    except ValidationError as err:
        return jsonify({"error": "Validation failed", "details": err.errors()}), 400

    created = data_store.add_lead(payload.dict())
    return jsonify({
        "message": "Quote request received! Our engineering team will contact you within 24 hours.",
        "lead_id": created["id"]
    }), 201
