from flask import Blueprint, request, jsonify
from email_utils import send_otp_email, send_password_reset_email
from models import User, Student, TeacherDetails, db
from random import randint
from flask_jwt_extended import create_access_token
from datetime import datetime, timedelta
import secrets

auth_bp = Blueprint("auth", __name__)
OTP_EXPIRY_MINUTES = 5
RESET_TOKEN_EXPIRY_MINUTES = 30

def generate_otp():
    return f"{randint(100000, 999999)}"

def generate_reset_token():
    return secrets.token_urlsafe(32)

@auth_bp.route("/register", methods=["POST"])
def register():
    if not request.is_json:
        return jsonify({"error": "Request must be JSON"}), 400

    data = request.get_json()
    email = data.get("email", "").strip()
    username = data.get("username", "").strip()
    role = data.get("role", "").lower()
    password = data.get("password", "").strip()

    if not email or not username or not password or not role:
        return jsonify({"error": "Email, username, password, and role are required"}), 400

    if role not in ["student", "teacher"]:
        return jsonify({"error": "Invalid role"}), 400

    allowed_domains = ["@gmail.com", "@ecajmer.ac.in"]
    if not any(email.endswith(domain) for domain in allowed_domains):
        return jsonify({"error": "Only Gmail or ecajmer.ac.in accounts are allowed"}), 400

    if User.query.filter((User.email == email) | (User.username == username)).first():
        return jsonify({"error": "Email or username already registered"}), 400

    user = User(email=email, username=username, role=role)
    db.session.add(user)
    db.session.commit()

    user.set_password(password)
    db.session.commit()

    if role == "student":
        student_profile = Student(
            user_id=user.id,
            full_name=data.get("full_name", "").strip(),
            attendance=100.0,
            avg_score=0.0,
            assignments_completed=0,
            behavior_score=0,
            additional_info=data.get("additional_info", "")
        )
        db.session.add(student_profile)

    if role == "teacher":
        teacher_details = TeacherDetails(
            user_id=user.id,
            full_name=data.get("full_name", "").strip(),
            employee_id=data.get("employee_id", "").strip(),
            subject=data.get("subject", "").strip(),
            department=data.get("department", "").strip()
        )
        db.session.add(teacher_details)

    db.session.commit()

    otp = generate_otp()
    user.set_otp(otp, expiry_minutes=OTP_EXPIRY_MINUTES)
    db.session.commit()

    if not send_otp_email(email, otp):
        return jsonify({"error": "Failed to send OTP"}), 500

    return jsonify({"message": "Registered successfully. OTP sent"}), 200


@auth_bp.route("/verify-otp", methods=["POST"])
def verify_otp():
    if not request.is_json:
        return jsonify({"error": "Request must be JSON"}), 400

    data = request.get_json()
    email = data.get("email", "").strip()
    otp = data.get("otp", "").strip()

    if not email or not otp:
        return jsonify({"error": "Email and OTP required"}), 400

    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({"error": "User not found"}), 404

    if user.verify_otp(otp):
        access_token = create_access_token(identity={
            "id": user.id,
            "username": user.username,
            "role": user.role.lower()
        })
        db.session.commit()
        return jsonify({"token": access_token}), 200

    return jsonify({"error": "Invalid or expired OTP"}), 400


@auth_bp.route("/login-password", methods=["POST"])
def login_password():
    if not request.is_json:
        return jsonify({"error": "Request must be JSON"}), 400

    data = request.get_json()
    identifier = data.get("email", "").strip()
    password = data.get("password", "").strip()

    if not identifier or not password:
        return jsonify({"error": "Email/Username and password required"}), 400

    user = None

    user = User.query.filter((User.email == identifier) | (User.username == identifier)).first()
    if not user:
        return jsonify({"error": "User not found"}), 404

    if not user or not user.check_password(password):
        return jsonify({"error": "Invalid credentials"}), 401

    access_token = create_access_token(identity={
        "id": user.id,
        "username": user.username,
        "role": user.role.lower()
    })

    return jsonify({"token": access_token}), 200


@auth_bp.route("/forgot-password", methods=["POST"])
def forgot_password():
    if not request.is_json:
        return jsonify({"error": "Request must be JSON"}), 400

    data = request.get_json()
    identifier = data.get("email", "").strip()

    if not identifier:
        return jsonify({"error": "Email or username required"}), 400

    if "@" in identifier:
        user = User.query.filter_by(email=identifier).first()
    else:
        user = User.query.filter_by(username=identifier).first()

    if not user:
        return jsonify({"message": "If account exists reset email sent"}), 200

    reset_token = generate_reset_token()
    user.reset_token = reset_token
    user.reset_token_expiry = datetime.utcnow() + timedelta(minutes=RESET_TOKEN_EXPIRY_MINUTES)
    db.session.commit()

    if not send_password_reset_email(user.email, reset_token):
        return jsonify({"error": "Failed to send reset email"}), 500

    return jsonify({"message": "Reset email sent"}), 200


@auth_bp.route("/reset-password", methods=["POST"])
def reset_password():
    if not request.is_json:
        return jsonify({"error": "Request must be JSON"}), 400

    data = request.get_json()
    token = data.get("token", "").strip()
    new_password = data.get("password", "").strip()

    if not token or not new_password:
        return jsonify({"error": "Token and password required"}), 400

    if len(new_password) < 6:
        return jsonify({"error": "Password must be at least 6 characters"}), 400

    user = User.query.filter_by(reset_token=token).first()

    if not user:
        return jsonify({"error": "Invalid token"}), 400

    if user.reset_token_expiry and datetime.utcnow() > user.reset_token_expiry:
        return jsonify({"error": "Token expired"}), 400

    user.set_password(new_password)
    user.reset_token = None
    user.reset_token_expiry = None
    db.session.commit()

    return jsonify({"message": "Password reset successful"}), 200


@auth_bp.route("/login", methods=["POST"])
def login():
    if not request.is_json:
        return jsonify({"error": "Request must be JSON"}), 400

    data = request.get_json()
    email = data.get("email", "").strip()
    password = data.get("password", "").strip()

    if not email:
        return jsonify({"error": "Email required"}), 400

    allowed_domains = ["@gmail.com", "@ecajmer.ac.in"]
    if not any(email.endswith(domain) for domain in allowed_domains):
        return jsonify({"error": "Only Gmail or ecajmer.ac.in accounts allowed"}), 400

    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({"error": "Email not registered"}), 404

    if password:
        if not user.check_password(password):
            return jsonify({"error": "Incorrect password"}), 401

        access_token = create_access_token(identity={
            "id": user.id,
            "username": user.username,
            "role": user.role.lower()
        })

        return jsonify({"token": access_token}), 200

    otp = generate_otp()
    user.set_otp(otp, expiry_minutes=OTP_EXPIRY_MINUTES)
    db.session.commit()

    if not send_otp_email(email, otp):
        return jsonify({"error": "Failed to send OTP"}), 500

    return jsonify({"message": "OTP sent"}), 200