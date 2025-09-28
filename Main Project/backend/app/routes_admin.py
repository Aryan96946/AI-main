from flask import Blueprint, request, jsonify
from .models import User, StudentProfile, Prediction
from . import db
from .utils import roles_required

admin_bp = Blueprint('admin', __name__)

@admin_bp.route('/users', methods=['GET'])
@roles_required('admin')
def list_users():
    users = User.query.all()
    out = [{'id': u.id, 'email': u.email, 'role': u.role, 'created_at': u.created_at.isoformat()} for u in users]
    return jsonify(out)

@admin_bp.route('/users/<int:user_id>', methods=['PUT'])
@roles_required('admin')
def update_user(user_id):
    data = request.get_json() or {}
    user = User.query.get(user_id)
    if not user:
        return jsonify({'msg':'not found'}), 404
    role = data.get('role')
    if role:
        user.role = role
    db.session.commit()
    return jsonify({'msg':'updated'})

@admin_bp.route('/students', methods=['GET'])
@roles_required('admin')
def list_students():
    students = StudentProfile.query.all()
    out = [{'id': s.id, 'user_id': s.user_id, 'name': s.name, 'gpa': s.gpa, 'attendance_rate': s.attendance_rate} for s in students]
    return jsonify(out)
