from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from .models import CounselNote, User
from . import db

counsel_bp = Blueprint('counsel', __name__)

def teacher_required(fn):
    from functools import wraps
    @wraps(fn)
    def wrapper(*args, **kwargs):
        ident = get_jwt_identity()
        if not ident or ident.get('role') not in ('teacher','admin'):
            return jsonify({"msg": "Teacher privileges required"}), 403
        return fn(*args, **kwargs)
    return wrapper

@counsel_bp.route('/note', methods=['POST'])
@jwt_required()
@teacher_required
def add_note():
    ident = get_jwt_identity()
    data = request.get_json()
    student_id = data.get('student_id')
    note_text = data.get('note')
    if not (student_id and note_text):
        return jsonify({"msg": "Missing fields"}), 400
    # ensure student exists
    student = User.query.get(student_id)
    if not student:
        return jsonify({"msg": "Student not found"}), 404
    note = CounselNote(student_id=student_id, teacher_id=ident['id'], note=note_text)
    db.session.add(note)
    db.session.commit()
    return jsonify({"msg": "Note added"}), 201

@counsel_bp.route('/notes/<int:student_id>', methods=['GET'])
@jwt_required()
def get_notes(student_id):
    # role check: teacher/admin or the student themself
    ident = get_jwt_identity()
    if ident['role'] not in ('teacher','admin') and ident['id'] != student_id:
        return jsonify({"msg": "Forbidden"}), 403
    notes = CounselNote.query.filter_by(student_id=student_id).all()
    return jsonify([{"id":n.id,"note":n.note,"teacher_id":n.teacher_id,"created_at":n.created_at.isoformat()} for n in notes]), 200
