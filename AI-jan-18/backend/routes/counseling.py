from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, CounselingSession, Student, User
from datetime import datetime

counseling_bp = Blueprint("counseling", __name__)

SESSION_TYPES = ['academic', 'behavioral', 'personal', 'career']
SEVERITY_LEVELS = ['low', 'medium', 'high', 'critical']
SESSION_STATUSES = ['scheduled', 'completed', 'cancelled', 'no-show']

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
    
    # New fields
    session_type = data.get("session_type", "academic")
    severity = data.get("severity", "medium")
    outcomes = data.get("outcomes", "")
    next_steps = data.get("next_steps", "")
    status = data.get("status", "scheduled")

    if not student_id or not notes:
        return jsonify({"error": "Missing student_id or notes"}), 400

    # Validate new fields
    if session_type not in SESSION_TYPES:
        return jsonify({"error": f"Invalid session_type. Must be one of: {SESSION_TYPES}"}), 400
    if severity not in SEVERITY_LEVELS:
        return jsonify({"error": f"Invalid severity. Must be one of: {SEVERITY_LEVELS}"}), 400
    if status not in SESSION_STATUSES:
        return jsonify({"error": f"Invalid status. Must be one of: {SESSION_STATUSES}"}), 400

    student = Student.query.get(student_id)
    if not student:
        return jsonify({"error": "Student not found"}), 404

    # Parse follow_up_at if provided
    follow_up_dt = None
    if follow_up_at:
        try:
            follow_up_dt = datetime.fromisoformat(follow_up_at.replace('Z', '+00:00'))
        except ValueError:
            return jsonify({"error": "Invalid follow_up_at format. Use ISO format."}), 400

    session = CounselingSession(
        student_id=student.id,
        teacher_id=identity.get("id"),
        notes=notes,
        follow_up_at=follow_up_dt,
        session_type=session_type,
        severity=severity,
        outcomes=outcomes,
        next_steps=next_steps,
        status=status
    )
    db.session.add(session)
    db.session.commit()

    return jsonify({"msg": "Counseling session added successfully", "session_id": session.id}), 201

@counseling_bp.route("/sessions", methods=["GET"])
@jwt_required()
def get_sessions():
    """Get all counseling sessions for the logged-in teacher"""
    identity = get_jwt_identity()
    if identity.get("role") not in ["teacher", "admin"]:
        return jsonify({"error": "Unauthorized"}), 403

    teacher_id = identity.get("id")
    
    # Get query params for filtering
    status_filter = request.args.get("status")
    severity_filter = request.args.get("severity")
    session_type_filter = request.args.get("type")
    
    query = CounselingSession.query.filter_by(teacher_id=teacher_id)
    
    if status_filter:
        query = query.filter_by(status=status_filter)
    if severity_filter:
        query = query.filter_by(severity=severity_filter)
    if session_type_filter:
        query = query.filter_by(session_type=session_type_filter)
    
    sessions = query.order_by(CounselingSession.created_at.desc()).all()
    
    result = []
    for session in sessions:
        student = Student.query.get(session.student_id)
        result.append({
            "id": session.id,
            "student_id": session.student_id,
            "student_name": student.full_name if student else "Unknown",
            "notes": session.notes,
            "follow_up_at": session.follow_up_at.isoformat() if session.follow_up_at else None,
            "created_at": session.created_at.isoformat(),
            "session_type": session.session_type,
            "severity": session.severity,
            "outcomes": session.outcomes,
            "next_steps": session.next_steps,
            "status": session.status
        })
    
    return jsonify({"sessions": result}), 200

@counseling_bp.route("/student/<int:student_id>", methods=["GET"])
@jwt_required()
def get_student_sessions(student_id):
    """Get all counseling sessions for a specific student"""
    identity = get_jwt_identity()
    if identity.get("role") not in ["teacher", "admin"]:
        return jsonify({"error": "Unauthorized"}), 403

    student = Student.query.get(student_id)
    if not student:
        return jsonify({"error": "Student not found"}), 404

    sessions = CounselingSession.query.filter_by(
        student_id=student_id
    ).order_by(CounselingSession.created_at.desc()).all()
    
    result = []
    for session in sessions:
        result.append({
            "id": session.id,
            "notes": session.notes,
            "follow_up_at": session.follow_up_at.isoformat() if session.follow_up_at else None,
            "created_at": session.created_at.isoformat(),
            "session_type": session.session_type,
            "severity": session.severity,
            "outcomes": session.outcomes,
            "next_steps": session.next_steps,
            "status": session.status,
            "teacher_id": session.teacher_id
        })
    
    return jsonify({"sessions": result, "student_name": student.full_name}), 200

@counseling_bp.route("/<int:session_id>", methods=["GET"])
@jwt_required()
def get_session(session_id):
    """Get a single counseling session by ID"""
    identity = get_jwt_identity()
    if identity.get("role") not in ["teacher", "admin"]:
        return jsonify({"error": "Unauthorized"}), 403

    session = CounselingSession.query.filter_by(
        id=session_id,
        teacher_id=identity.get("id")
    ).first()
    
    if not session:
        return jsonify({"error": "Session not found or unauthorized"}), 404

    student = Student.query.get(session.student_id)
    
    return jsonify({
        "id": session.id,
        "student_id": session.student_id,
        "student_name": student.full_name if student else "Unknown",
        "notes": session.notes,
        "follow_up_at": session.follow_up_at.isoformat() if session.follow_up_at else None,
        "created_at": session.created_at.isoformat(),
        "session_type": session.session_type,
        "severity": session.severity,
        "outcomes": session.outcomes,
        "next_steps": session.next_steps,
        "status": session.status
    }), 200

@counseling_bp.route("/<int:session_id>", methods=["PUT"])
@jwt_required()
def update_session(session_id):
    """Update a counseling session"""
    identity = get_jwt_identity()
    if identity.get("role") not in ["teacher", "admin"]:
        return jsonify({"error": "Unauthorized"}), 403

    session = CounselingSession.query.filter_by(
        id=session_id,
        teacher_id=identity.get("id")
    ).first()
    
    if not session:
        return jsonify({"error": "Session not found or unauthorized"}), 404

    data = request.get_json()
    
    # Update fields if provided
    if "notes" in data:
        session.notes = data["notes"]
    if "outcomes" in data:
        session.outcomes = data["outcomes"]
    if "next_steps" in data:
        session.next_steps = data["next_steps"]
    
    if "session_type" in data:
        if data["session_type"] not in SESSION_TYPES:
            return jsonify({"error": f"Invalid session_type. Must be one of: {SESSION_TYPES}"}), 400
        session.session_type = data["session_type"]
    
    if "severity" in data:
        if data["severity"] not in SEVERITY_LEVELS:
            return jsonify({"error": f"Invalid severity. Must be one of: {SEVERITY_LEVELS}"}), 400
        session.severity = data["severity"]
    
    if "status" in data:
        if data["status"] not in SESSION_STATUSES:
            return jsonify({"error": f"Invalid status. Must be one of: {SESSION_STATUSES}"}), 400
        session.status = data["status"]
    
    if "follow_up_at" in data and data["follow_up_at"]:
        try:
            session.follow_up_at = datetime.fromisoformat(data["follow_up_at"].replace('Z', '+00:00'))
        except ValueError:
            return jsonify({"error": "Invalid follow_up_at format"}), 400
    elif "follow_up_at" in data and data["follow_up_at"] is None:
        session.follow_up_at = None

    db.session.commit()
    
    return jsonify({"msg": "Session updated successfully"}), 200

@counseling_bp.route("/<int:session_id>", methods=["DELETE"])
@jwt_required()
def delete_session(session_id):
    """Delete a counseling session"""
    identity = get_jwt_identity()
    if identity.get("role") not in ["teacher", "admin"]:
        return jsonify({"error": "Unauthorized"}), 403

    session = CounselingSession.query.filter_by(
        id=session_id,
        teacher_id=identity.get("id")
    ).first()
    
    if not session:
        return jsonify({"error": "Session not found or unauthorized"}), 404

    db.session.delete(session)
    db.session.commit()
    
    return jsonify({"msg": "Session deleted successfully"}), 200

@counseling_bp.route("/upcoming", methods=["GET"])
@jwt_required()
def get_upcoming():
    """Get upcoming follow-ups (scheduled sessions with follow_up_at in the future)"""
    identity = get_jwt_identity()
    if identity.get("role") not in ["teacher", "admin"]:
        return jsonify({"error": "Unauthorized"}), 403

    now = datetime.utcnow()
    
    sessions = CounselingSession.query.filter(
        CounselingSession.teacher_id == identity.get("id"),
        CounselingSession.status == "scheduled",
        CounselingSession.follow_up_at != None,
        CounselingSession.follow_up_at > now
    ).order_by(CounselingSession.follow_up_at.asc()).all()
    
    result = []
    for session in sessions:
        student = Student.query.get(session.student_id)
        result.append({
            "id": session.id,
            "student_id": session.student_id,
            "student_name": student.full_name if student else "Unknown",
            "follow_up_at": session.follow_up_at.isoformat(),
            "session_type": session.session_type,
            "severity": session.severity,
            "notes": session.notes[:100] + "..." if session.notes and len(session.notes) > 100 else session.notes
        })
    
    return jsonify({"upcoming": result}), 200

