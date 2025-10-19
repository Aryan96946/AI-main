from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, Student, User
import pandas as pd

students_bp = Blueprint('students', __name__, url_prefix='/api/students')  # changed to plural

@students_bp.route('/me', methods=['GET'])
@jwt_required()
def get_my_profile():
    identity = get_jwt_identity() or {}
    role = (identity.get('role') or '').lower()
    user_id = identity.get('id')

    if role != 'student' or not user_id:
        return jsonify({'msg': 'Access denied. Not a student.'}), 403

    student = Student.query.filter_by(user_id=user_id).first()
    if not student:
        return jsonify({'msg': 'No profile found'}), 404

    preds = [{'risk_score': p.risk_score, 'created_at': p.created_at} for p in student.predictions]
    sessions = [{'id': s.id, 'notes': s.notes, 'created_at': s.created_at} for s in student.counseling_sessions]

    return jsonify({
        'student': {
            'id': student.id,
            'full_name': student.full_name,
            'grade': student.grade,
            'attendance': student.attendance,
            'avg_score': student.avg_score,
            'predictions': preds,
            'counseling_sessions': sessions
        }
    }), 200

@students_bp.route('/<int:sid>', methods=['PUT'])
@jwt_required()
def update_student(sid):
    identity = get_jwt_identity() or {}
    role = (identity.get('role') or '').lower()
    if role not in ['teacher', 'admin']:
        return jsonify({'msg': 'Unauthorized'}), 403

    student = Student.query.get(sid)
    if not student:
        return jsonify({'msg': 'Student not found'}), 404

    data = request.json or {}
    for field in ['full_name', 'grade', 'attendance', 'avg_score', 'additional_info']:
        if field in data:
            try:
                if field in ['attendance', 'avg_score']:
                    setattr(student, field, float(data[field]))
                else:
                    setattr(student, field, data[field])
            except (ValueError, TypeError):
                continue

    db.session.commit()
    return jsonify({'msg': 'Student updated'}), 200

@students_bp.route('/import', methods=['POST'])
@jwt_required()
def import_students():
    identity = get_jwt_identity() or {}
    role = (identity.get('role') or '').lower()
    if role != 'admin':
        return jsonify({'msg': 'Unauthorized'}), 403

    file = request.files.get('file')
    if not file:
        return jsonify({'msg': 'File required'}), 400

    df = pd.read_csv(file)
    added = 0

    for _, row in df.iterrows():
        username = row.get('username') or row.get('full_name')
        if not username or User.query.filter_by(username=username).first():
            continue

        try:
            user = User(
                username=username,
                role='student',
                email=row.get('email')
            )
            user.set_password(row.get('password', 'changeme123'))
            db.session.add(user)
            db.session.flush()  # assign id before adding student

            attendance = float(row.get('attendance', 100))
            avg_score = float(row.get('avg_score', 0))

            student = Student(
                user_id=user.id,
                full_name=row.get('full_name', username),
                grade=row.get('grade'),
                attendance=attendance,
                avg_score=avg_score
            )
            db.session.add(student)
            added += 1
        except Exception:
            db.session.rollback()
            continue

    db.session.commit()
    return jsonify({'added': added}), 201
