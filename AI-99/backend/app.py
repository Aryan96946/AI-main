from flask import Flask, jsonify
from flask_cors import CORS
from config import Config
from models import db
from routes.auth_routes import auth_bp
from routes.students import students_bp
from routes.teachers import teachers_bp
from routes.counseling import counseling_bp
from routes.admin import admin_bp
from routes.predict import predict_bp
from routes.upload_csv import upload_bp
from flask_jwt_extended import JWTManager
from flask_mail import Mail
from flask_migrate import Migrate 

mail = Mail()
jwt = JWTManager()
migrate = Migrate()  


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    CORS(app, resources={r"/api/*": {"origins": "*"}})

    db.init_app(app)
    jwt.init_app(app)
    mail.init_app(app)
    migrate.init_app(app, db)  #

    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(students_bp, url_prefix="/api/students")
    app.register_blueprint(teachers_bp, url_prefix="/api/teachers")
    app.register_blueprint(admin_bp, url_prefix="/api/admin")
    app.register_blueprint(predict_bp, url_prefix="/api")
    app.register_blueprint(counseling_bp, url_prefix="/api/counseling")
    app.register_blueprint(upload_bp, url_prefix="/api")

    @app.route("/api/health", methods=["GET"])
    def health():
        return jsonify({"status": "ok"}), 200

    @app.route("/", methods=["GET"])
    def home():
        return jsonify({"message": "Welcome to the AI Backend API!"}), 200

    return app


app = create_app()

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True, threaded=True)
