from flask import Blueprint, request, jsonify
from email_utils import send_otp_email
from models import User, Student, TeacherDetails, db
from random import randint
from flask_jwt_extended import create_access_token
from sqlalchemy.exc import IntegrityError

auth_bp = Blueprint("auth", __name__)
OTP_EXPIRY_MINUTES = 5

def generate_otp() -> str:
    """Generate a 6-digit OTP."""
    return f"{randint(100000, 999999)}"

# ---------------- REGISTER ---------------- #
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
        return jsonify({"error": "Invalid role. Only 'student' or 'teacher' allowed."}), 400

    if not email.endswith("@gmail.com"):
        return jsonify({"error": "Only Gmail accounts are allowed"}), 400

    if User.query.filter((User.email == email) | (User.username == username)).first():
        return jsonify({"error": "Email or username already registered"}), 400

    # Create user and set password
    user = User(email=email, username=username, role=role)
    user.set_password(password)  # Use instance method

    db.session.add(user)
    try:
        db.session.commit()
    except IntegrityError:
        db.session.rollback()
        return jsonify({"error": "Database error while creating user"}), 500

    # Create student or teacher profile
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

    elif role == "teacher":
        teacher_details = TeacherDetails(
            user_id=user.id,
            full_name=data.get("full_name", "").strip(),
            employee_id=data.get("employee_id", "").strip(),
            subject=data.get("subject", "").strip()
        )
        db.session.add(teacher_details)

    db.session.commit()

    # Generate and set OTP
    otp = generate_otp()
    user.set_otp(otp, expiry_minutes=OTP_EXPIRY_MINUTES)

    if not send_otp_email(email, otp):
        return jsonify({"error": "Failed to send OTP"}), 500

    return jsonify({"message": "Registered successfully. OTP sent to your Gmail."}), 200

# ---------------- VERIFY OTP ---------------- #
@auth_bp.route("/verify-otp", methods=["POST"])
def verify_otp():
    if not request.is_json:
        return jsonify({"error": "Request must be JSON"}), 400

    data = request.get_json()
    email = data.get("email", "").strip()
    otp = data.get("otp", "").strip()

    if not email or not otp:
        return jsonify({"error": "Email and OTP are required"}), 400

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
        return jsonify({"message": "Verified successfully", "token": access_token}), 200

    return jsonify({"error": "Invalid or expired OTP"}), 400

# ---------------- LOGIN WITH PASSWORD ---------------- #
@auth_bp.route("/login-password", methods=["POST"])
def login_password():
    if not request.is_json:
        return jsonify({"error": "Request must be JSON"}), 400

    data = request.get_json()
    email = data.get("email", "").strip()
    password = data.get("password", "").strip()

    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

    user = User.query.filter_by(email=email).first()
    if not user or not user.check_password(password):
        return jsonify({"error": "Invalid email or password"}), 401

    access_token = create_access_token(identity={
        "id": user.id,
        "username": user.username,
        "role": user.role.lower()
    })
    return jsonify({"message": "Login successful", "token": access_token}), 200

# ---------------- LOGIN WITH OTP ---------------- #
@auth_bp.route("/login", methods=["POST"])
def login():
    if not request.is_json:
        return jsonify({"error": "Request must be JSON"}), 400

    data = request.get_json()
    email = data.get("email", "").strip()
    password = data.get("password", "").strip()

    if not email:
        return jsonify({"error": "Email is required"}), 400

    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({"error": "Email not registered"}), 404

    # Password login
    if password:
        if not user.check_password(password):
            return jsonify({"error": "Incorrect password"}), 401
        access_token = create_access_token(identity={
            "id": user.id,
            "username": user.username,
            "role": user.role.lower()
        })
        return jsonify({"message": "Login successful", "token": access_token}), 200

    # OTP login
    otp = generate_otp()
    user.set_otp(otp, expiry_minutes=OTP_EXPIRY_MINUTES)

    if not send_otp_email(email, otp):
        return jsonify({"error": "Failed to send OTP"}), 500

    return jsonify({"message": "OTP sent to Gmail. Verify with /verify-otp."}), 200
