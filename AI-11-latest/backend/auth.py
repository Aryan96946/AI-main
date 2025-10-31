from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from models import db, User, Student
from flask_jwt_extended import create_access_token
from datetime import timedelta

auth_bp = Blueprint("auth", __name__)
ACCESS_TOKEN_EXPIRES = timedelta(hours=1)

@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")
    role = (data.get("role") or "student").lower()

    if not username or not password:
        return jsonify({"error": "Username and password are required"}), 400
    if role not in ["student", "teacher", "admin"]:
        return jsonify({"error": "Invalid role"}), 400
    if User.query.filter_by(username=username).first():
        return jsonify({"error": "User already exists"}), 400

    user = User(
        username=username,
        password_hash=generate_password_hash(password),
        role=role
    )
    db.session.add(user)

    if role == "student":
        student = Student(user_id=user.id, full_name=username)
        db.session.add(student)

    db.session.commit()
    return jsonify({"message": "User registered successfully", "user_id": user.id}), 201

@auth_bp.route("/login-password", methods=["POST"])
def login_password():
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")

    if not username or not password:
        return jsonify({"error": "Username and password are required"}), 400

    user = User.query.filter_by(username=username).first()
    if not user or not check_password_hash(user.password_hash, password):
        return jsonify({"error": "Invalid username or password"}), 401

    token = create_access_token(
        identity={"id": user.id, "role": user.role, "username": user.username},
        expires_delta=ACCESS_TOKEN_EXPIRES
    )

    return jsonify({
        "message": "Login successful",
        "token": token,
        "user": {"id": user.id, "username": user.username, "role": user.role}
    }), 200

@auth_bp.route("/verify-otp", methods=["POST"])
def verify_otp():
    data = request.get_json()
    email = data.get("email")
    otp = data.get("otp")

    if not email or not otp:
        return jsonify({"error": "Email and OTP are required"}), 400

    user = User.query.filter_by(username=email).first()
    if not user:
        return jsonify({"error": "User not found"}), 404

    token = create_access_token(
        identity={"id": user.id, "role": user.role, "username": user.username},
        expires_delta=ACCESS_TOKEN_EXPIRES
    )

    return jsonify({
        "message": "OTP verified successfully",
        "token": token,
        "user": {"id": user.id, "username": user.username, "role": user.role}
    }), 200
