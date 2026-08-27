"""
SRM Homes Backend Application Factory
"""

from flask import Flask, jsonify
from flask_cors import CORS
from config import Config

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Enable CORS for specified origins (and allow local dev requests)
    CORS(
        app,
        resources={r"/api/*": {"origins": "*"}},
        supports_credentials=False
    )

    # Register blueprints
    from app.blueprints.health import health_bp
    from app.blueprints.auth import auth_bp
    from app.blueprints.projects import projects_bp
    from app.blueprints.testimonials import testimonials_bp
    from app.blueprints.leads import leads_bp
    from app.blueprints.uploads import uploads_bp
    from app.blueprints.posts import posts_bp
    from app.blueprints.admin import admin_bp
    from app.blueprints.estimator import estimator_bp
    from app.blueprints.services import services_bp

    app.register_blueprint(health_bp, url_prefix="/api")
    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(auth_bp, url_prefix="/api/admin/auth", name="auth_admin_alt")
    app.register_blueprint(admin_bp, url_prefix="/api/admin")
    app.register_blueprint(services_bp, url_prefix="/api/services")
    app.register_blueprint(services_bp, url_prefix="/api/admin/services", name="services_admin_alt")
    app.register_blueprint(projects_bp, url_prefix="/api/projects")
    app.register_blueprint(testimonials_bp, url_prefix="/api/testimonials")
    app.register_blueprint(leads_bp, url_prefix="/api/leads")
    app.register_blueprint(uploads_bp, url_prefix="/api/uploads")
    app.register_blueprint(posts_bp, url_prefix="/api/posts")
    app.register_blueprint(estimator_bp, url_prefix="/api/estimator")



    @app.errorhandler(404)
    def handle_404(e):
        return jsonify({"error": "Resource not found"}), 404

    @app.errorhandler(500)
    def handle_500(e):
        return jsonify({"error": "Internal server error"}), 500

    return app
