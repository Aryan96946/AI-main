from flask import Blueprint, jsonify, request, Response
from flask_jwt_extended import jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash
from models import db, User, Student, Prediction
from sqlalchemy.exc import IntegrityError
from sqlalchemy import func
import csv
import io
from datetime import datetime, timedelta

admin_bp = Blueprint('admin', __name__, url_prefix='/api/admin')

def admin_only():
    identity = get_jwt_identity() or {}
    role = identity.get('role', '').lower()
    return role == 'admin'

@admin_bp.route('/users', methods=['GET'])
@jwt_required()
def list_users():
    if not admin_only():
        return jsonify({'msg': 'Access denied. Admins only.'}), 403

    users = User.query.all()
    return jsonify([
        {
            'id': u.id,
            'username': u.username,
            'email': u.email,
            'role': u.role,
            'created_at': u.created_at
        } for u in users
    ]), 200

@admin_bp.route('/users', methods=['POST'])
@jwt_required()
def create_user():
    if not admin_only():
        return jsonify({'msg': 'Access denied. Admins only.'}), 403

    data = request.get_json() or {}
    username = data.get('username')
    email = data.get('email')
    password = data.get('password', 'changeme')
    role = data.get('role', 'student')

    if not username or not email:
        return jsonify({'msg': 'Username and email are required'}), 400

    if User.query.filter((User.username==username) | (User.email==email)).first():
        return jsonify({'msg': 'Username or email already exists'}), 400

    user = User(
        username=username,
        email=email,
        password_hash=generate_password_hash(password),
        role=role
    )
    try:
        db.session.add(user)
        db.session.commit()
    except IntegrityError as e:
        db.session.rollback()
        return jsonify({'msg': 'Database error', 'error': str(e)}), 500

    return jsonify({'id': user.id, 'msg': 'User created successfully'}), 201

@admin_bp.route('/analytics', methods=['GET'])
@jwt_required()
def analytics():
    if not admin_only():
        return jsonify({'msg': 'Access denied. Admins only.'}), 403

    students = Student.query.all()
    
    # High risk count (latest prediction > 0.6)
    high_risk = 0
    risk_distribution = {"Very High": 0, "High": 0, "Moderate": 0, "Low": 0, "Minimal": 0}
    
    for s in students:
        if s.predictions:
            latest = s.predictions[-1]
            if latest.risk_score > 0.6:
                high_risk += 1
            # Determine risk tier
            if latest.risk_score >= 0.85:
                risk_distribution["Very High"] += 1
            elif latest.risk_score >= 0.70:
                risk_distribution["High"] += 1
            elif latest.risk_score >= 0.50:
                risk_distribution["Moderate"] += 1
            elif latest.risk_score >= 0.30:
                risk_distribution["Low"] += 1
            else:
                risk_distribution["Minimal"] += 1
    
    # Risk by course
    course_risk = db.session.query(
        Student.course,
        func.count(Student.id).label('total'),
        func.avg(func.coalesce(Prediction.risk_score, 0)).label('avg_risk')
    ).outerjoin(Prediction).group_by(Student.course).all()
    
    course_risk_data = [
        {
            "course": c.course or "Unknown",
            "total": c.total,
            "avg_risk": round(c.avg_risk, 3) if c.avg_risk else 0
        }
        for c in course_risk
    ]
    
    # Monthly trend (last 6 months)
    six_months_ago = datetime.utcnow() - timedelta(days=180)
    monthly_predictions = db.session.query(
        func.date_format(Prediction.created_at, '%Y-%m').label('month'),
        func.count(Prediction.id).label('count'),
        func.avg(Prediction.risk_score).label('avg_risk')
    ).filter(Prediction.created_at >= six_months_ago).group_by(
        func.date_format(Prediction.created_at, '%Y-%m')
    ).all()
    
    monthly_trend = [
        {
            "month": m.month,
            "predictions": m.count,
            "avg_risk": round(m.avg_risk, 3) if m.avg_risk else 0
        }
        for m in monthly_predictions
    ]
    
    # Student stats
    total_students = len(students)
    students_with_predictions = sum(1 for s in students if s.predictions)
    avg_attendance = sum(s.attendance for s in students if s.attendance) / total_students if total_students > 0 else 0
    avg_academic = sum(s.academic_score for s in students if s.academic_score) / total_students if total_students > 0 else 0

    return jsonify({
        'total_students': total_students,
        'high_risk_count': high_risk,
        'risk_distribution': risk_distribution,
        'course_risk': course_risk_data,
        'monthly_trend': monthly_trend,
        'students_with_predictions': students_with_predictions,
        'avg_attendance': round(avg_attendance, 1),
        'avg_academic_score': round(avg_academic, 1)
    }), 200

@admin_bp.route('/predictions', methods=['GET'])
@jwt_required()
def get_predictions():
    """Get prediction history with pagination"""
    if not admin_only():
        return jsonify({'msg': 'Access denied. Admins only.'}), 403
    
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 50, type=int)
    
    # Get all predictions with student info
    predictions = Prediction.query.join(Student).order_by(
        Prediction.created_at.desc()
    ).paginate(page=page, per_page=per_page, error_out=False)
    
    return jsonify({
        'predictions': [
            {
                'id': p.id,
                'student_id': p.student_id,
                'student_name': p.student.full_name if p.student else None,
                'risk_score': p.risk_score,
                'model_version': p.model_version,
                'created_at': p.created_at.isoformat() if p.created_at else None
            }
            for p in predictions.items
        ],
        'total': predictions.total,
        'pages': predictions.pages,
        'current_page': page
    }), 200

@admin_bp.route('/export', methods=['GET'])
@jwt_required()
def export_data():
    """Export student data as CSV"""
    if not admin_only():
        return jsonify({'msg': 'Access denied. Admins only.'}), 403
    
    students = Student.query.all()
    
    output = io.StringIO()
    writer = csv.writer(output)
    
    # Header
    writer.writerow([
        'ID', 'Student ID', 'Full Name', 'Course', 'Gender', 
        'Attendance', 'Academic Score', 'Grade', 'Risk Score', 
        'Latest Prediction Date'
    ])
    
    # Data
    for s in students:
        risk_score = s.predictions[-1].risk_score if s.predictions else None
        pred_date = s.predictions[-1].created_at if s.predictions else None
        
        writer.writerow([
            s.id, s.student_id, s.full_name, s.course, s.gender,
            s.attendance, s.academic_score, s.grade, risk_score,
            pred_date.isoformat() if pred_date else ''
        ])
    
    output.seek(0)
    return Response(
        output.getvalue(),
        mimetype="text/csv",
        headers={"Content-disposition": "attachment; filename=students_export.csv"}
    )
