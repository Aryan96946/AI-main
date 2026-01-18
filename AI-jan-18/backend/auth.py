from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from models import db, User, Student
from flask_jwt_extended import create_access_token
from datetime import timedelta, datetime
import random
import string
from email_utils import send_otp_email, send_password_reset_email

auth_bp = Blueprint("auth", __name__)
ACCESS_TOKEN_EXPIRES = timedelta(hours=6)

# Password reset code storage (in production, use Redis or database)
password_reset_codes = {}  # {email: {"code": "123456", "expires": datetime}}


def generate_token(user):
    return create_access_token(
        identity={
            "id": user.id,
            "email": user.username,   
            "role": user.role
        },
        expires_delta=ACCESS_TOKEN_EXPIRES
    )


def generate_reset_code():
    """Generate a 6-digit numeric code."""
    return ''.join(random.choices(string.digits, k=6))


@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json() or {}
    email = data.get("email")
    password = data.get("password")
    role = (data.get("role") or "student").lower()

    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

    if role not in ["student", "teacher", "admin"]:
        return jsonify({"error": "Invalid role"}), 400

    if User.query.filter_by(username=email).first():
        return jsonify({"error": "User already exists"}), 400

    user = User(
        username=email,  
        password_hash=generate_password_hash(password),
        role=role
    )
    db.session.add(user)
    db.session.flush()

    if role == "student":
        student = Student(user_id=user.id, full_name=email)
        db.session.add(student)

    db.session.commit()

    return jsonify({"message": "User registered successfully", "user_id": user.id}), 201


@auth_bp.route("/login-password", methods=["POST"])
def login_password():
    data = request.get_json() or {}
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

    user = User.query.filter_by(username=email).first()
    if not user or not check_password_hash(user.password_hash, password):
        return jsonify({"error": "Invalid email or password"}), 401

    token = generate_token(user)

    return jsonify({
        "message": "Login successful",
        "token": token,
        "user": {
            "id": user.id,
            "email": user.username,
            "role": user.role
        }
    }), 200


@auth_bp.route("/verify-otp", methods=["POST"])
def verify_otp():
    data = request.get_json() or {}
    email = data.get("email") 
    otp = data.get("otp")

    if not email or not otp:
        return jsonify({"error": "Email and OTP are required"}), 400

    user = User.query.filter_by(username=email).first()
    if not user:
        return jsonify({"error": "User not found"}), 404

    token = generate_token(user)

    return jsonify({
        "message": "OTP verified successfully",
        "token": token,
        "user": {
            "id": user.id,
            "email": user.username,
            "role": user.role
        }
    }), 200


@auth_bp.route("/forgot-password", methods=["POST"])
def forgot_password():
    """
    Send a password reset code to the user's email.
    """
    data = request.get_json() or {}
    email = data.get("email")

    if not email:
        return jsonify({"error": "Email is required"}), 400

    if not email.endswith("@gmail.com"):
        return jsonify({"error": "Only Gmail accounts are allowed"}), 400

    user = User.query.filter_by(username=email).first()
    if not user:
        return jsonify({"error": "User not found"}), 404

    # Generate reset code
    reset_code = generate_reset_code()
    
    # Store with 15 minute expiry
    password_reset_codes[email] = {
        "code": reset_code,
        "expires": datetime.now() + timedelta(minutes=15)
    }

    # Send email
    success = send_password_reset_email(email, reset_code, 15)
    
    if success:
        return jsonify({
            "message": "Password reset code sent to your email",
            "email": email
        }), 200
    else:
        return jsonify({"error": "Failed to send reset email. Please try again."}), 500


@auth_bp.route("/verify-reset-code", methods=["POST"])
def verify_reset_code():
    """
    Verify the reset code and allow password change.
    """
    data = request.get_json() or {}
    email = data.get("email")
    code = data.get("code")
    new_password = data.get("new_password")

    if not email or not code or not new_password:
        return jsonify({"error": "Email, code, and new password are required"}), 400

    # Check if code exists and is valid
    reset_data = password_reset_codes.get(email)
    if not reset_data:
        return jsonify({"error": "Invalid or expired reset code"}), 400

    if datetime.now() > reset_data["expires"]:
        del password_reset_codes[email]
        return jsonify({"error": "Reset code has expired"}), 400

    if reset_data["code"] != code:
        return jsonify({"error": "Invalid reset code"}), 400

    # Update password
    user = User.query.filter_by(username=email).first()
    if not user:
        return jsonify({"error": "User not found"}), 404

    user.password_hash = generate_password_hash(new_password)
    db.session.commit()

    # Clear the reset code
    del password_reset_codes[email]

    return jsonify({
        "message": "Password reset successfully. You can now login with your new password."
    }), 200
