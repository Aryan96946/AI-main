from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, CounselingSession, Student

counseling_bp = Blueprint("counseling", __name__)

@counseling_bp.route("/add", methods=["POST"])
@jwt_required()
def add_counseling():
    identity = get_jwt_identity()
    if identity.get("role") not in ["teacher", "admin"]:
        return jsonify({"error": "Unauthorized"}), 403

    data = request.get_json()
    student_id = data.get("student_id")
    notes = data.get("notes")
    follow_up_at = data.get("follow_up_at")

    if not student_id or not notes:
        return jsonify({"error": "Missing student_id or notes"}), 400

    student = Student.query.get(student_id)
    if not student:
        return jsonify({"error": "Student not found"}), 404

    session = CounselingSession(
        student_id=student.id,
        teacher_id=identity.get("id"),
        notes=notes,
        follow_up_at=follow_up_at
    )
    db.session.add(session)
    db.session.commit()

    return jsonify({"msg": "Counseling session added successfully"}), 201
