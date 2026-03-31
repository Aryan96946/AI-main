from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
import os

db = SQLAlchemy()
jwt = JWTManager()

def create_app():
    app = Flask(__name__)
    CORS(app)

    # Configuration
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv(
        'DATABASE_URL', 
        'mysql+pymysql://aryan:password@localhost/aidropout'
    )
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'supersecretkey')

    # Initialize extensions
    db.init_app(app)
    jwt.init_app(app)

    # Import and register blueprints
    from .routes.auth_routes import auth_bp
    from .routes.students import students_bp      # <- rename to plural
    from .routes.teachers import teachers_bp      # <- rename to plural
    from .routes.admin import admin_bp
# after other blueprint imports
    from .upload_csv import upload_bp
    from .ml_routes import ml_bp
    app.register_blueprint(ml_bp, url_prefix="/api/ml")

    app.register_blueprint(upload_bp, url_prefix="/api/admin")

    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(students_bp, url_prefix="/api/students")   # fixed plural
    app.register_blueprint(teachers_bp, url_prefix="/api/teachers")   # fixed plural
    app.register_blueprint(admin_bp, url_prefix="/api/admin")

    @app.route('/')
    def home():
        return {"message": "AI Dropout Prediction API running successfully"}

    return app
