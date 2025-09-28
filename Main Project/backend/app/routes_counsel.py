# backend/app/routes_counsel.py
from flask import Blueprint, request, jsonify
from .models import CounselingSession, StudentProfile, User, Prediction
from . import db
from .utils import roles_required
from flask_jwt_extended import get_jwt_identity

counsel_bp = Blueprint('counsel', __name__)

@counsel_bp.route('/session', methods=['POST'])
@roles_required('counselor', 'admin')
def create_session():
    data = request.get_json() or {}
    student_id = data.get('student_id')
    notes = data.get('notes')
    outcome = data.get('outcome', '')

    if not student_id or not notes:
        return jsonify({'msg': 'student_id and notes required'}), 400

    student = StudentProfile.query.get(student_id)
    if not student:
        return jsonify({'msg': 'student not found'}), 404

    identity = get_jwt_identity()
    counselor_id = identity.get('id')

    session = CounselingSession(student_id=student_id, counselor_id=counselor_id, notes=notes, outcome=outcome)
    db.session.add(session)
    db.session.commit()
    return jsonify({'msg': 'session created', 'session_id': session.id}), 201

@counsel_bp.route('/student/<int:student_id>/sessions', methods=['GET'])
@roles_required('counselor', 'admin')
def list_sessions(student_id):
    student = StudentProfile.query.get(student_id)
    if not student:
        return jsonify({'msg': 'student not found'}), 404
    rows = CounselingSession.query.filter_by(student_id=student_id).order_by(CounselingSession.created_at.desc()).all()
    out = [{'id': r.id, 'counselor_id': r.counselor_id, 'notes': r.notes, 'outcome': r.outcome, 'created_at': r.created_at.isoformat()} for r in rows]
    return jsonify(out)

@counsel_bp.route('/high-risk', methods=['GET'])
@roles_required('counselor', 'admin')
def high_risk():
    # returns students with most recent prediction labeled 'high'
    subq = db.session.query(Prediction).order_by(Prediction.student_id, Prediction.created_at.desc()).subquery()
    # simpler approach: query most recent per student (approx)
    high = db.session.query(Prediction).filter(Prediction.risk_label == 'high').order_by(Prediction.created_at.desc()).limit(100).all()
    out = []
    for p in high:
        student = StudentProfile.query.get(p.student_id)
        out.append({
            'prediction_id': p.id,
            'student_id': p.student_id,
            'student_name': student.name if student else '',
            'risk_score': p.risk_score,
            'predicted_at': p.created_at.isoformat()
        })
    return jsonify(out)
