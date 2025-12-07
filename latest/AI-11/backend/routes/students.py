from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, Student, User
import pandas as pd

students_bp = Blueprint('students', __name__, url_prefix='/api/students')


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

    student_data = {
        'id': student.id,
        'full_name': student.full_name,
        'course': student.course,
        'gender': student.gender,
        'marital_status': student.marital_status,
        'application_mode': student.application_mode,
        'age_at_enrollment': student.age_at_enrollment,
        'scholarship_holder': student.scholarship_holder,
        'debtor': student.debtor,
        'tuition_fees_up_to_date': student.tuition_fees_up_to_date,

        'cu1_enrolled': student.cu1_enrolled,
        'cu1_approved': student.cu1_approved,
        'cu1_grade': student.cu1_grade,
        'cu2_enrolled': student.cu2_enrolled,
        'cu2_approved': student.cu2_approved,
        'cu2_grade': student.cu2_grade,

        'grade': student.grade,
        'attendance': student.attendance,
        'avg_score': student.avg_score,

        'predictions': [
            {'risk_score': p.risk_score, 'created_at': p.created_at}
            for p in student.predictions
        ],
        'counseling_sessions': [
            {'id': s.id, 'notes': s.notes, 'created_at': s.created_at}
            for s in student.counseling_sessions
        ],
    }

    return jsonify({'student': student_data}), 200


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

    editable_fields = [
        'full_name', 'grade', 'attendance', 'avg_score',
        'course', 'gender', 'marital_status', 'application_mode',
        'age_at_enrollment', 'scholarship_holder', 'debtor',
        'tuition_fees_up_to_date',
        'cu1_enrolled', 'cu1_approved', 'cu1_grade',
        'cu2_enrolled', 'cu2_approved', 'cu2_grade'
    ]

    for field in editable_fields:
        if field in data:
            try:
                if field in [
                    'attendance', 'avg_score',
                    'cu1_enrolled', 'cu1_approved', 'cu1_grade',
                    'cu2_enrolled', 'cu2_approved', 'cu2_grade',
                    'age_at_enrollment'
                ]:
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
            db.session.flush()

            student = Student(
                user_id=user.id,
                full_name=row.get('full_name', username),
                grade=row.get('grade'),
                attendance=float(row.get('attendance', 100)),
                avg_score=float(row.get('avg_score', 0)),
                course=row.get('course'),
                gender=row.get('gender'),
                marital_status=row.get('marital_status'),
                application_mode=row.get('application_mode'),
                age_at_enrollment=row.get('age_at_enrollment'),
                scholarship_holder=row.get('scholarship_holder'),
                debtor=row.get('debtor'),
                tuition_fees_up_to_date=row.get('tuition_fees_up_to_date'),
                cu1_enrolled=row.get('cu1_enrolled'),
                cu1_approved=row.get('cu1_approved'),
                cu1_grade=row.get('cu1_grade'),
                cu2_enrolled=row.get('cu2_enrolled'),
                cu2_approved=row.get('cu2_approved'),
                cu2_grade=row.get('cu2_grade')
            )
            db.session.add(student)
            added += 1

        except Exception:
            db.session.rollback()
            continue

    db.session.commit()
    return jsonify({'added': added}), 201
