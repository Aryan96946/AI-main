from flask import Flask, jsonify
from flask_cors import CORS
from config import Config
from models import db
from routes.auth_routes import auth_bp
from routes.students import students_bp
from routes.teachers import teachers_bp
from routes.admin import admin_bp
from routes.predict import predict_bp
from flask_jwt_extended import JWTManager
from flask_mail import Mail

mail = Mail()
jwt = JWTManager()

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    
    CORS(app)
    
    # Initialize extensions
    db.init_app(app)
    jwt.init_app(app)
    mail.init_app(app)
    
    # Register blueprints
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(students_bp, url_prefix='/api/students')
    app.register_blueprint(teachers_bp, url_prefix='/api/teachers')
    app.register_blueprint(admin_bp, url_prefix='/api/admin')
    app.register_blueprint(predict_bp, url_prefix="/api")
    
    @app.route('/api/health', methods=['GET'])
    def health():
        return jsonify({'status': 'ok'}), 200

    @app.route('/', methods=['GET'])
    def home():
        return jsonify({'message': 'Welcome to the AI Backend API!'}), 200

    return app


app = create_app()

if __name__ == '__main__':
    with app.app_context():
        db.create_all()  # For dev only
    app.run(host='0.0.0.0', port=5000, debug=True, threaded=True)
