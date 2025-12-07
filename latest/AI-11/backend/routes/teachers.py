import os
import joblib
import pandas as pd
import traceback
from flask import Blueprint, jsonify, request, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from dateutil import parser
from models import db, Student, CounselingSession, Prediction
from ml.preprocess import clean_data

teachers_bp = Blueprint('teachers', __name__, url_prefix='/api/teacher')

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL_PATH = os.path.join(BASE_DIR, "ml", "model.pkl")
PREPROCESSOR_PATH = os.path.join(BASE_DIR, "ml", "preprocess.pkl")

try:
    model = joblib.load(MODEL_PATH)
except Exception:
    model = None

try:
    preprocessor = joblib.load(PREPROCESSOR_PATH)
except Exception:
    preprocessor = None

def teacher_or_admin_required():
    identity = get_jwt_identity() or {}
    role = (identity.get('role') or '').lower()
    user_id = identity.get('id')
    if role not in ['teacher', 'admin'] or not user_id:
        return None, jsonify({'msg': 'Unauthorized'}), 403
    return identity, None, None

def _get_expected_features_from_preprocessor(p):
    if p is None:
        return []
    if hasattr(p, "feature_names_in_"):
        return list(p.feature_names_in_)
    if hasattr(p, "get_feature_names_out"):
        try:
            return list(p.get_feature_names_out())
        except:
            pass
    if hasattr(p, "named_steps") and "preprocessor" in p.named_steps:
        return _get_expected_features_from_preprocessor(p.named_steps["preprocessor"])
    if hasattr(p, "transformers_"):
        cols = []
        for _, _, cols_spec in p.transformers_:
            if isinstance(cols_spec, (list, tuple)):
                cols.extend(list(cols_spec))
        return cols
    return []

FEATURES_16 = [
    "age_at_enrollment",
    "marital_status",
    "application_mode",
    "application_order",
    "course",
    "attendance_type",
    "previous_qualification",
    "previous_qualification_grade",
    "mother_qualification",
    "father_qualification",
    "admission_grade",
    "curricular_units_1st_sem_grade",
    "curricular_units_2nd_sem_grade",
    "unemployment_rate",
    "inflation_rate",
    "gdp"
]

FALLBACK_ATTRS = {
    "age_at_enrollment": ["age_at_enrollment"],
    "marital_status": ["marital_status"],
    "application_mode": ["application_mode"],
    "application_order": ["application_order"],
    "course": ["course", "class_name"],
    "attendance_type": ["attendance_type", "day_evening"],
    "previous_qualification": ["previous_qualification"],
    "previous_qualification_grade": ["previous_qualification_grade"],
    "mother_qualification": ["mother_qualification", "mother_education"],
    "father_qualification": ["father_qualification", "father_education"],
    "admission_grade": ["admission_grade"],
    "curricular_units_1st_sem_grade": ["curricular_units_1st_sem_grade", "cu1_grade"],
    "curricular_units_2nd_sem_grade": ["curricular_units_2nd_sem_grade", "cu2_grade"],
    "unemployment_rate": ["unemployment_rate"],
    "inflation_rate": ["inflation_rate"],
    "gdp": ["gdp"]
}

def _get_student_value(s, feature):
    for attr in FALLBACK_ATTRS.get(feature, [feature]):
        if hasattr(s, attr):
            return getattr(s, attr)
    return None

@teachers_bp.route('/students', methods=['GET'])
@jwt_required()
def list_students():
    identity, resp, code = teacher_or_admin_required()
    if resp:
        return resp, code

    students = Student.query.all()
    output = []
    for s in students:
        latest_pred = s.predictions[-1].risk_score if s.predictions else None
        output.append({
            'id': s.id,
            'full_name': s.full_name,
            'course': s.course,
            'gender': s.gender,
            'marital_status': s.marital_status,
            'application_mode': s.application_mode,
            'age_at_enrollment': s.age_at_enrollment,
            'scholarship_holder': s.scholarship_holder,
            'debtor': s.debtor,
            'tuition_fees_up_to_date': s.tuition_fees_up_to_date,
            'cu1_enrolled': s.cu1_enrolled,
            'cu1_approved': s.cu1_approved,
            'cu1_grade': s.cu1_grade,
            'cu2_enrolled': s.cu2_enrolled,
            'cu2_approved': s.cu2_approved,
            'cu2_grade': s.cu2_grade,
            'attendance': s.attendance,
            'avg_score': s.avg_score,
            'risk_score': latest_pred
        })
    return jsonify({'students': output}), 200

@teachers_bp.route('/<int:student_id>/counsel', methods=['POST'])
@jwt_required()
def add_counseling(student_id):
    identity, resp, code = teacher_or_admin_required()
    if resp:
        return resp, code

    data = request.get_json() or {}
    notes = (data.get('notes') or '').strip()
    follow_up = data.get('follow_up_at')

    student = Student.query.get(student_id)
    if not student:
        return jsonify({'msg': 'Student not found'}), 404

    cs = CounselingSession(
        student_id=student.id,
        teacher_id=identity['id'],
        notes=notes
    )

    if follow_up:
        try:
            cs.follow_up_at = parser.isoparse(follow_up)
        except:
            return jsonify({'msg': 'Invalid follow_up_at format'}), 400

    try:
        db.session.add(cs)
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({'msg': 'Database error', 'error': str(e)}), 500

    return jsonify({'msg': 'Counseling session created', 'session_id': cs.id}), 201

@teachers_bp.route('/<int:student_id>/counsel', methods=['GET'])
@jwt_required()
def get_counseling(student_id):
    identity, resp, code = teacher_or_admin_required()
    if resp:
        return resp, code

    sessions = CounselingSession.query.filter_by(student_id=student_id).all()
    output = []
    for s in sessions:
        output.append({
            'id': s.id,
            'notes': s.notes,
            'teacher_id': s.teacher_id,
            'created_at': s.created_at.isoformat(),
            'follow_up_at': s.follow_up_at.isoformat() if s.follow_up_at else None
        })
    return jsonify({'sessions': output}), 200

@teachers_bp.route('/batch_predict', methods=['POST'])
@jwt_required()
def batch_predict():
    identity, resp, code = teacher_or_admin_required()
    if resp:
        return resp, code

    if model is None:
        return jsonify({'msg': 'ML model not loaded'}), 500

    students = Student.query.all()
    if not students:
        return jsonify({'msg': 'No students found'}), 200

    records = []
    student_map = {}

    expected_cols = _get_expected_features_from_preprocessor(preprocessor)
    if not expected_cols:
        expected_cols = FEATURES_16

    expected_cols = [c for c in expected_cols if c in FEATURES_16]

    for idx, s in enumerate(students):
        rec = {}
        for feat in FEATURES_16:
            val = _get_student_value(s, feat)
            rec[feat] = val if val is not None else 0
        records.append(rec)
        student_map[idx] = s.id

    X = pd.DataFrame(records)
    X = clean_data(X)

    try:
        X = X.reindex(columns=expected_cols, fill_value=0)

        if preprocessor is not None and preprocessor is not model:
            X_processed = preprocessor.transform(X)
        else:
            if hasattr(model, "named_steps") and "preprocessor" in model.named_steps:
                X_processed = model.named_steps["preprocessor"].transform(X)
            else:
                X_processed = X.values
    except Exception as e:
        tb = traceback.format_exc()
        return jsonify({
            'msg': 'Preprocessing failed',
            'error': str(e),
            'expected_columns': expected_cols,
            'received_columns': list(X.columns),
            'traceback': tb if current_app.config.get("DEBUG") else None
        }), 500

    try:
        if hasattr(model, "predict_proba"):
            probs = model.predict_proba(X_processed)[:, 1]
        elif hasattr(model, "named_steps") and "classifier" in model.named_steps:
            probs = model.named_steps["classifier"].predict_proba(X_processed)[:, 1]
        else:
            probs = model.predict(X_processed)
    except Exception as e:
        tb = traceback.format_exc()
        return jsonify({
            'msg': 'Prediction failed',
            'error': str(e),
            'traceback': tb if current_app.config.get("DEBUG") else None
        }), 500

    created = 0
    for idx, score in enumerate(probs):
        pred = Prediction(
            student_id=student_map[idx],
            risk_score=float(max(0.0, min(1.0, float(score))))
        )
        db.session.add(pred)
        created += 1

    try:
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        tb = traceback.format_exc()
        return jsonify({
            'msg': 'Database error',
            'error': str(e),
            'traceback': tb if current_app.config.get("DEBUG") else None
        }), 500

    return jsonify({'msg': f'{created} predictions created'}), 201
