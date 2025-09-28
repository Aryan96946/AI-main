from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from .models import User, RoleEnum, StudentProfile
from . import db

admin_bp = Blueprint("admin", __name__)

def admin_required():
    identity = get_jwt_identity()
    if identity["role"] != "admin":
        return False
    return True

@admin_bp.route("/users", methods=["GET"])
@jwt_required()
def list_users():
    if not admin_required():
        return jsonify({"error": "Admin only"}), 403
    users = User.query.all()
    out = [{"id": u.id, "email": u.email, "fullname": u.fullname, "role": u.role.value} for u in users]
    return jsonify(out)

@admin_bp.route("/user/<int:user_id>/promote", methods=["POST"])
@jwt_required()
def promote_user(user_id):
    if not admin_required():
        return jsonify({"error": "Admin only"}), 403
    data = request.get_json() or {}
    role = data.get("role")
    if role not in RoleEnum.__members__:
        return jsonify({"error": "Invalid role"}), 400
    user = User.query.get_or_404(user_id)
    user.role = RoleEnum[role]
    if user.role == RoleEnum.student and not user.profile:
        profile = StudentProfile(user_id=user.id)
        db.session.add(profile)
    db.session.commit()
    return jsonify({"msg": "Updated", "user": {"id": user.id, "role": user.role.value}})
