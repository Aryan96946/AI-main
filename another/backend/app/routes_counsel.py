from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from .models import CounselingSession, User
from . import db

counsel_bp = Blueprint("counsel", __name__)

@counsel_bp.route("/session", methods=["POST"])
@jwt_required()
def create_session():
    identity = get_jwt_identity()
    data = request.get_json() or {}
    # Only teacher or admin can create a session record
    if identity["role"] not in ("teacher", "admin"):
        return jsonify({"error": "Only teachers/admins can create counseling notes"}), 403
    student_id = data.get("student_id")
    notes = data.get("notes", "")
    if not student_id:
        return jsonify({"error": "student_id required"}), 400
    session = CounselingSession(student_id=student_id, teacher_id=identity["id"], notes=notes)
    db.session.add(session)
    db.session.commit()
    return jsonify({"msg": "Saved", "id": session.id})

@counsel_bp.route("/sessions/<int:student_id>", methods=["GET"])
@jwt_required()
def get_sessions(student_id):
    identity = get_jwt_identity()
    # students can see their own sessions, teachers/admins can see any
    if identity["role"] == "student" and identity["id"] != student_id:
        return jsonify({"error": "Forbidden"}), 403
    sessions = CounselingSession.query.filter_by(student_id=student_id).order_by(CounselingSession.created_at.desc()).all()
    out = [{"id": s.id, "teacher_id": s.teacher_id, "notes": s.notes, "created_at": s.created_at.isoformat()} for s in sessions]
    return jsonify(out)
