from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash
from models import db, User, Student
from sqlalchemy.exc import IntegrityError

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
    high_risk = sum(
        1 for s in students if s.predictions and s.predictions[-1].risk_score > 0.6
    )

    return jsonify({
        'total_students': len(students),
        'high_risk_count': high_risk
    }), 200
