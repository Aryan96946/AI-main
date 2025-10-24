from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, User, Student, CounselingSession, Prediction
import random
from dateutil import parser

teachers_bp = Blueprint('teachers', __name__, url_prefix='/api/teacher')


def teacher_or_admin_required():
    """Helper to check if current user is teacher or admin."""
    identity = get_jwt_identity() or {}
    role = (identity.get('role') or '').lower()
    user_id = identity.get('id')
    if role not in ['teacher', 'admin'] or not user_id:
        return None, jsonify({'msg': 'Unauthorized'}), 403
    return identity, None, None


@teachers_bp.route('/students', methods=['GET'])
@jwt_required()
def list_students():
    identity, resp, code = teacher_or_admin_required()
    if resp:
        return resp, code

    students = Student.query.all()
    out = []
    for s in students:
        latest = s.predictions[-1].risk_score if s.predictions else None
        out.append({
            'id': s.id,
            'full_name': s.full_name,
            'attendance': s.attendance,
            'avg_score': s.avg_score,
            'risk_score': latest
        })
    return jsonify({'students': out}), 200


@teachers_bp.route('/<int:student_id>/counsel', methods=['POST'])
@jwt_required()
def add_counseling(student_id):
    identity, resp, code = teacher_or_admin_required()
    if resp:
        return resp, code

    user_id = identity['id']
    data = request.json or {}
    notes = str(data.get('notes', '')).strip()
    follow_up = data.get('follow_up_at')

    cs = CounselingSession(student_id=student_id, teacher_id=user_id, notes=notes)
    if follow_up:
        try:
            cs.follow_up_at = parser.isoparse(follow_up)
        except Exception:
            return jsonify({'msg': 'Invalid follow_up_at format'}), 400

    try:
        db.session.add(cs)
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({'msg': 'Database error', 'error': str(e)}), 500

    return jsonify({'msg': 'Created', 'session_id': cs.id}), 201


@teachers_bp.route('/batch_predict', methods=['POST'])
@jwt_required()
def batch_predict():
    identity, resp, code = teacher_or_admin_required()
    if resp:
        return resp, code

    students = Student.query.all()
    created = 0
    for s in students:
        score = 1 - (s.attendance / 100) * 0.6 - (s.avg_score / 100) * 0.4 + random.uniform(-0.1, 0.1)
        score = max(0.0, min(1.0, score))
        pred = Prediction(student_id=s.id, risk_score=score)
        db.session.add(pred)
        created += 1

    try:
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({'msg': 'Database error', 'error': str(e)}), 500

    return jsonify({'created': created}), 201
