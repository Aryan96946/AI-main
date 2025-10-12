from flask import Blueprint, request, jsonify, current_app, send_from_directory
from .models import User
from . import db, bcrypt
from flask_jwt_extended import create_access_token, create_refresh_token, jwt_required, get_jwt_identity

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')
    role = data.get('role', 'student')
    if not (username and email and password):
        return jsonify({"msg": "Missing fields"}), 400
    if User.query.filter((User.username == username) | (User.email == email)).first():
        return jsonify({"msg": "User exists"}), 400
    pw_hash = bcrypt.generate_password_hash(password).decode('utf-8')
    user = User(username=username, email=email, password_hash=pw_hash, role=role)
    db.session.add(user)
    db.session.commit()
    return jsonify({"msg": "Registered", "user": user.to_dict()}), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    if not (username and password):
        return jsonify({"msg": "Missing fields"}), 400
    user = User.query.filter((User.username == username) | (User.email == username)).first()
    if not user or not bcrypt.check_password_hash(user.password_hash, password):
        return jsonify({"msg": "Bad username or password"}), 401
    access = create_access_token(identity={"id": user.id, "role": user.role})
    refresh = create_refresh_token(identity={"id": user.id, "role": user.role})
    return jsonify({"access_token": access, "refresh_token": refresh, "user": user.to_dict()}), 200

@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def me():
    ident = get_jwt_identity()
    user = User.query.get(ident['id'])
    if not user:
        return jsonify({"msg": "Not found"}), 404
    return jsonify({"user": user.to_dict()}), 200
