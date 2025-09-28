# backend/app/auth.py
from flask import Blueprint, request, jsonify
from . import db, bcrypt
from .models import User, StudentProfile
from flask_jwt_extended import create_access_token, create_refresh_token, jwt_required, get_jwt_identity
from marshmallow import ValidationError
from .schemas import RegisterSchema, LoginSchema

auth_bp = Blueprint('auth', __name__)

register_schema = RegisterSchema()
login_schema = LoginSchema()

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json() or {}
    try:
        validated = register_schema.load(data)
    except ValidationError as e:
        return jsonify({'msg': 'invalid input', 'errors': e.messages}), 400

    email = validated['email']
    password = validated['password']
    role = validated.get('role', 'student')

    if User.query.filter_by(email=email).first():
        return jsonify({'msg': 'user exists'}), 409

    pw_hash = bcrypt.generate_password_hash(password).decode()
    user = User(email=email, password_hash=pw_hash, role=role)
    db.session.add(user)
    db.session.commit()

    # If student, create an empty profile
    if role == 'student':
        sp = StudentProfile(user_id=user.id, name='', other_features={})
        db.session.add(sp)
        db.session.commit()

    return jsonify({'msg': 'registered'}), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json() or {}
    try:
        validated = login_schema.load(data)
    except ValidationError as e:
        return jsonify({'msg': 'invalid input', 'errors': e.messages}), 400

    email = validated['email']
    password = validated['password']
    user = User.query.filter_by(email=email).first()
    if not user or not bcrypt.check_password_hash(user.password_hash, password):
        return jsonify({'msg': 'bad credentials'}), 401

    identity = {'id': user.id, 'role': user.role}
    access = create_access_token(identity=identity)
    refresh = create_refresh_token(identity=identity)
    return jsonify({'access_token': access, 'refresh_token': refresh, 'role': user.role, 'user_id': user.id})

@auth_bp.route('/refresh', methods=['POST'])
@jwt_required(refresh=True)
def refresh():
    identity = get_jwt_identity()
    access = create_access_token(identity=identity)
    return jsonify({'access_token': access})
