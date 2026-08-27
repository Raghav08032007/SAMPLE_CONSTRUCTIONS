from flask import Blueprint, jsonify, request
from pydantic import ValidationError
from app.models.schemas import TestimonialCreateSchema
from app.services.data_store import data_store

testimonials_bp = Blueprint("testimonials", __name__)

@testimonials_bp.route("", methods=["GET"])
def get_approved_testimonials():
    testimonials = data_store.get_testimonials(approved_only=True)
    return jsonify({"testimonials": testimonials}), 200

@testimonials_bp.route("", methods=["POST"])
def submit_testimonial():
    try:
        data = request.get_json() or {}
        payload = TestimonialCreateSchema(**data)
    except ValidationError as err:
        return jsonify({"error": "Validation failed", "details": err.errors()}), 400

    created = data_store.add_testimonial(payload.dict())
    return jsonify({
        "message": "Thank you! Your review has been submitted and will appear after admin review.",
        "testimonial": created
    }), 201
