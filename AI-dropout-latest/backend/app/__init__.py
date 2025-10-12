import os
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager
from flask_migrate import Migrate

db = SQLAlchemy()
bcrypt = Bcrypt()
jwt = JWTManager()
migrate = Migrate()

def create_app():
    app = Flask(__name__, template_folder="../frontend/templates", static_folder="../frontend/static")
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'sqlite:///dev.db')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'dev-secret')
    app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'jwt-secret')

    db.init_app(app)
    bcrypt.init_app(app)
    jwt.init_app(app)
    migrate.init_app(app, db)

    # import models so they're registered
    from . import models

    # register blueprints
    from .routes_auth import auth_bp
    from .routes_predict import predict_bp
    from .routes_admin import admin_bp
    from .routes_counsel import counsel_bp
    app.register_blueprint(auth_bp, url_prefix='/auth')
    app.register_blueprint(predict_bp, url_prefix='/predict')
    app.register_blueprint(admin_bp, url_prefix='/admin')
    app.register_blueprint(counsel_bp, url_prefix='/counsel')

    # index routes
    from flask import render_template

    @app.route('/')
    def index():
       return render_template('index.html')

    @app.route('/dashboard')
    def dashboard():
       return render_template('index.html')


    return app

# create app instance for gunicorn
app = create_app()
