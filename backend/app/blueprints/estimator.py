from flask import Blueprint, jsonify, request

estimator_bp = Blueprint("estimator", __name__)

PRICING_CONFIG = {
    "residential": {
        "basic": {"min": 1800, "max": 2100},
        "standard": {"min": 2200, "max": 2600},
        "premium": {"min": 2800, "max": 3500},
    },
    "commercial": {
        "basic": {"min": 2400, "max": 2800},
        "standard": {"min": 2900, "max": 3400},
        "premium": {"min": 3600, "max": 4500},
    },
    "renovation": {
        "basic": {"min": 1200, "max": 1500},
        "standard": {"min": 1600, "max": 2000},
        "premium": {"min": 2200, "max": 2800},
    }
}

@estimator_bp.route("/pricing", methods=["GET"])
def get_pricing_config():
    """
    Public Endpoint: Returns pricing rate configuration per sq ft.
    Stored server-side so rates can be updated without frontend redeploy.
    """
    return jsonify({"pricing": PRICING_CONFIG}), 200

@estimator_bp.route("/calculate", methods=["POST"])
def calculate_estimate():
    data = request.get_json() or {}
    plot_size = float(data.get("plot_size", 0))
    construction_type = data.get("construction_type", "residential")
    finish_tier = data.get("finish_tier", "standard")

    if plot_size <= 0:
        return jsonify({"error": "Plot size must be greater than 0"}), 400

    type_config = PRICING_CONFIG.get(construction_type, PRICING_CONFIG["residential"])
    tier_config = type_config.get(finish_tier, type_config["standard"])

    min_estimate = plot_size * tier_config["min"]
    max_estimate = plot_size * tier_config["max"]

    return jsonify({
        "plot_size": plot_size,
        "construction_type": construction_type,
        "finish_tier": finish_tier,
        "rate_per_sqft_min": tier_config["min"],
        "rate_per_sqft_max": tier_config["max"],
        "min_estimate": min_estimate,
        "max_estimate": max_estimate,
        "currency": "INR"
    }), 200
