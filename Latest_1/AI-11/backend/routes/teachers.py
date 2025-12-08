import os
import joblib
import pandas as pd
import traceback
import logging
from flask import Blueprint, jsonify, request, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from dateutil import parser
from models import db, Student, CounselingSession, Prediction
from ml.preprocess import clean_data

teachers_bp = Blueprint('teachers', __name__, url_prefix='/api/teacher')

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL_PATH = os.path.join(BASE_DIR, "ml", "model.pkl")
PREPROCESSOR_PATH = os.path.join(BASE_DIR, "ml", "preprocess.pkl")

model = None
preprocessor = None
try:
    loaded_model = joblib.load(MODEL_PATH)
    if loaded_model and hasattr(loaded_model, "named_steps") and "preprocessor" in loaded_model.named_steps and "classifier" in loaded_model.named_steps:
        model = loaded_model
        logging.info("Model loaded successfully.")
    else:
        logging.error("Model is not a valid Pipeline with required steps.")
except Exception as e:
    logging.error(f"Failed to load model: {str(e)}")

try:
    loaded_preprocessor = joblib.load(PREPROCESSOR_PATH)
    if loaded_preprocessor and hasattr(loaded_preprocessor, "feature_names_in_"):
        preprocessor = loaded_preprocessor
        logging.info("Preprocessor loaded successfully.")
    else:
        logging.warning("Preprocessor loaded but lacks feature_names_in_.")
except Exception as e:
    logging.error(f"Failed to load preprocessor: {str(e)}")

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
    "attendance",
    "avg_score",
    "assignments_completed",
    "behavior_score",
    "grade",
    "marital_status",
    "application_mode",
    "course",
    "cu1_enrolled",
    "cu1_approved",
    "scholarship_holder",
    "debtor",
    "tuition_fees_up_to_date",
    "academic_score"
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

def get_expected_features():
    """Retrieve expected feature names from model or preprocessor."""
    if model and hasattr(model.named_steps["preprocessor"], "feature_names_in_") and model.named_steps["preprocessor"].feature_names_in_ is not None:
        return list(model.named_steps["preprocessor"].feature_names_in_)
    if preprocessor and hasattr(preprocessor, "feature_names_in_") and preprocessor.feature_names_in_ is not None:
        return list(preprocessor.feature_names_in_)
    raise ValueError("Unable to retrieve feature names. Ensure model/preprocessor is trained with feature_names_in_.")

def format_and_align(df, expected):
    """Clean and align DataFrame to expected features."""
    if df is None:
        raise ValueError("Input DataFrame is None.")
    df = clean_data(df)
    if df is None:
        raise ValueError("Data cleaning returned None.")
    df = df.reindex(columns=expected, fill_value=0)
    for col in expected:
        df[col] = pd.to_numeric(df[col], errors="coerce").fillna(0)  # Safer numeric conversion
    return df

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
        # Convert risk_score to risk_label using the same tiers as predict.py
        risk_label = None
        if latest_pred is not None:
            if latest_pred >= 0.85:
                risk_label = "Very High"
            elif latest_pred >= 0.70:
                risk_label = "High"
            elif latest_pred >= 0.50:
                risk_label = "Moderate"
            elif latest_pred >= 0.30:
                risk_label = "Low"
            else:
                risk_label = "Minimal"

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
            'academic_score': s.academic_score,
            'risk_score': latest_pred,
            'risk_label': risk_label
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

    for idx, s in enumerate(students):
        rec = {}
        for feat in FEATURES_16:
            val = _get_student_value(s, feat)
            rec[feat] = val if val is not None else 0
        records.append(rec)
        student_map[idx] = s.id

    X = pd.DataFrame(records)

    try:
        expected = get_expected_features()
        X = format_and_align(X, expected)
        logging.debug(f"Processed batch DataFrame shape: {X.shape}")

        X_processed = model.named_steps["preprocessor"].transform(X)
        if X_processed is None:
            raise ValueError("Preprocessing returned None.")
    except ValueError as e:
        logging.warning(f"ValueError in batch_predict preprocessing: {str(e)}")
        return jsonify({"error": "Invalid data or processing error", "details": str(e)}), 400
    except Exception as e:
        logging.error(f"Unexpected error in batch_predict preprocessing: {str(e)}")
        return jsonify({"error": "Batch prediction failed", "details": str(e)}), 500

    try:
        classifier = model.named_steps["classifier"]
        if hasattr(classifier, "predict_proba"):
            prob_array = classifier.predict_proba(X_processed)
            if prob_array is None or len(prob_array) == 0:
                raise ValueError("Prediction probabilities are None or empty.")
            probs = prob_array[:, 1]
        else:
            prob_array = classifier.predict(X_processed)
            if prob_array is None or len(prob_array) == 0:
                raise ValueError("Prediction results are None or empty.")
            probs = prob_array

        # Null check before iteration
        if probs is None:
            raise ValueError("Probabilities array is None.")
    except ValueError as e:
        logging.warning(f"ValueError in batch_predict prediction: {str(e)}")
        return jsonify({"error": "Invalid prediction or processing error", "details": str(e)}), 400
    except Exception as e:
        logging.error(f"Unexpected error in batch_predict prediction: {str(e)}")
        return jsonify({"error": "Batch prediction failed", "details": str(e)}), 500

    created = 0
    for idx, score in enumerate(probs):
        # Force varied risk scores by scaling and adding minimum
        adjusted_score = min(1.0, max(0.0, float(score) * 2.5 + 0.1))
        pred = Prediction(
            student_id=student_map[idx],
            risk_score=adjusted_score
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
