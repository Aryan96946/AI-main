from flask import Blueprint, request, jsonify
from .models import User, RoleEnum, StudentProfile
from . import db
from .schemas import RegisterSchema, LoginSchema
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity

auth_bp = Blueprint("auth", __name__)
register_schema = RegisterSchema()
login_schema = LoginSchema()

@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    errors = register_schema.validate(data)
    if errors:
        return jsonify({"error": errors}), 400
    email = data["email"].lower()
    if User.query.filter_by(email=email).first():
        return jsonify({"error": "Email already registered"}), 400
    user = User(fullname=data["fullname"], email=email, role=RoleEnum[data.get("role", "student")])
    user.set_password(data["password"])
    db.session.add(user)
    db.session.commit()

    # create empty student profile if student
    if user.role == RoleEnum.student:
        profile = StudentProfile(user_id=user.id)
        db.session.add(profile)
        db.session.commit()

    return jsonify({"msg": "Registered", "user": {"id": user.id, "email": user.email}}), 201

@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    errors = login_schema.validate(data)
    if errors:
        return jsonify({"error": errors}), 400
    email = data["email"].lower()
    user = User.query.filter_by(email=email).first()
    if not user or not user.check_password(data["password"]):
        return jsonify({"error": "Invalid credentials"}), 401
    access = create_access_token(identity={"id": user.id, "role": user.role.value})
    return jsonify({"access_token": access, "user": {"id": user.id, "email": user.email, "fullname": user.fullname, "role": user.role.value}})
