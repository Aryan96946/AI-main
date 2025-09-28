import os
from flask import Flask, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from dotenv import load_dotenv

load_dotenv()

db = SQLAlchemy()
migrate = Migrate()
jwt = JWTManager()

def create_app():
    app = Flask(__name__, static_folder="../../frontend/static", template_folder="../../frontend/templates")
    # Config
    app.config.from_object('app.config.Config')

    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)

    # Register blueprints
    from .routes_admin import admin_bp
    from .auth import auth_bp
    from .routes_predict import predict_bp
    from .routes_counsel import counsel_bp

    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(admin_bp, url_prefix="/api/admin")
    app.register_blueprint(predict_bp, url_prefix="/api/predict")
    app.register_blueprint(counsel_bp, url_prefix="/api/counsel")

    @app.route("/")
    def index():
        return app.send_static_file('index.html')

    return app

# For gunicorn
app = create_app()
