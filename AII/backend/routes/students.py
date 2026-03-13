from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, Student, User
import pandas as pd
import os
import joblib

students_bp = Blueprint('students', __name__, url_prefix='/api/students')


def classify_risk(score):
    if score is None:
        return "Unknown"
    if score >= 0.85:
        return "Very High"
    if score >= 0.70:
        return "High"
    if score >= 0.50:
        return "Moderate"
    if score >= 0.30:
        return "Low"
    return "Minimal"


def get_prediction_details(student):
    """Get detailed prediction info for a student"""
    if not student.predictions:
        return None
    
    latest = student.predictions[-1]
    return {
        'risk_score': latest.risk_score,
        'risk_percentage': round(latest.risk_score * 100, 2),
        'risk_tier': classify_risk(latest.risk_score),
        'model_version': latest.model_version,
        'created_at': latest.created_at.isoformat() if latest.created_at else None
    }


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

    latest_prediction = (
        student.predictions[-1] if student.predictions else None
    )

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

        'curricular_units_1st_sem_enrolled': student.cu1_enrolled,
        'curricular_units_1st_sem_approved': student.cu1_approved,
        'curricular_units_1st_sem_grade': student.cu1_grade,
        'curricular_units_2nd_sem_enrolled': student.cu2_enrolled,
        'curricular_units_2nd_sem_approved': student.cu2_approved,
        'curricular_units_2nd_sem_grade': student.cu2_grade,

        'grade': student.grade,
        'attendance': student.attendance,
        'avg_score': student.avg_score,
        'academic_score': student.academic_score,

        # unified risk display
        'latest_risk_score_raw': latest_prediction.risk_score if latest_prediction else None,
        'latest_risk_percentage': round(latest_prediction.risk_score * 100, 2) if latest_prediction else None,
        'latest_risk_tier': classify_risk(latest_prediction.risk_score) if latest_prediction else "Unknown",

        # all predictions
        'predictions': [
            {
                'risk_score': p.risk_score,
                'risk_percentage': round(p.risk_score * 100, 2),
                'risk_tier': classify_risk(p.risk_score),
                'model_version': p.model_version,
                'created_at': p.created_at.isoformat() if p.created_at else None
            }
            for p in student.predictions
        ],

        'counseling_sessions': [
            {
                'id': s.id, 
                'notes': s.notes, 
                'created_at': s.created_at.isoformat() if s.created_at else None,
                'follow_up_at': s.follow_up_at.isoformat() if s.follow_up_at else None
            }
            for s in student.counseling_sessions
        ],
    }

    return jsonify({'student': student_data}), 200


@students_bp.route('/me/predict', methods=['POST'])
@jwt_required()
def predict_for_me():
    """Allow students to get a new prediction for themselves"""
    identity = get_jwt_identity() or {}
    role = (identity.get('role') or '').lower()
    user_id = identity.get('id')

    if role != 'student' or not user_id:
        return jsonify({'msg': 'Access denied. Not a student.'}), 403

    student = Student.query.filter_by(user_id=user_id).first()
    if not student:
        return jsonify({'msg': 'No profile found'}), 404

    # Check if model exists
    MODEL_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), "ml", "model.pkl")
    if not os.path.exists(MODEL_PATH):
        return jsonify({'error': 'Model not trained yet'}), 400

    try:
        model = joblib.load(MODEL_PATH)
        
        # Build features from student data
        import pandas as pd
        from ..ml.preprocess import clean_data
        from ..ml.explain import explain_prediction
        from ..ml.recommend import get_recommendation
        
        # Create data frame with student features
        data = {
            'attendance': student.attendance or 75,
            'avg_score': student.avg_score or 70,
            'assignments_completed': student.assignments_completed or 5,
            'behavior_score': student.behavior_score or 80,
            'grade': student.grade or 'B',
            'marital_status': student.marital_status or 'Single',
            'application_mode': student.application_mode or 'Regular',
            'course': student.course or 'Computer Science',
            'cu1_enrolled': student.cu1_enrolled or 5,
            'cu1_approved': student.cu1_approved or 4,
            'scholarship_holder': student.scholarship_holder or 'No',
            'debtor': student.debtor or 'No',
            'tuition_fees_up_to_date': student.tuition_fees_up_to_date or 'Yes',
            'academic_score': student.academic_score or 70
        }
        
        df = pd.DataFrame([data])
        df = clean_data(df)
        
        # Get expected features
        if hasattr(model, "named_steps") and "preprocessor" in model.named_steps:
            prep = model.named_steps["preprocessor"]
            if hasattr(prep, "feature_names_in_"):
                expected = list(prep.feature_names_in_)
                for col in expected:
                    if col not in df.columns:
                        df[col] = 0
                df = df[expected]
        
        # Predict
        probas = model.predict_proba(df)
        classes = model.named_steps["classifier"].classes_
        dropout_idx = list(classes).index("Dropout") if "Dropout" in classes else 0
        prob = probas[0][dropout_idx]
        
        risk_tier = classify_risk(prob)
        rec = get_recommendation(prob)
        suggestions = [s.strip() for s in rec.split(" – ") if s.strip()]
        expl = explain_prediction(model, df.iloc[0])
        
        if "error" in expl:
            explanation = []
        else:
            explanation = sorted(
                [{"feature": k, "shap": v} for k, v in expl.items()],
                key=lambda x: abs(x["shap"]),
                reverse=True
            )[:5]
        
        return jsonify({
            'risk_tier': risk_tier,
            'probability': prob,
            'probability_percentage': round(prob * 100, 2),
            'suggestions': suggestions,
            'explanation': explanation
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


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
        'full_name', 'grade', 'attendance', 'avg_score', 'academic_score',
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
                    'attendance', 'avg_score', 'academic_score',
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
                academic_score=row.get('academic_score'),
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


@students_bp.route('/', methods=['GET'])
@jwt_required()
def get_all_students():
    identity = get_jwt_identity() or {}
    role = (identity.get('role') or '').lower()

    if role not in ['teacher', 'admin']:
        return jsonify({'msg': 'Unauthorized'}), 403

    students = Student.query.all()
    students_data = []

    for student in students:
        students_data.append({
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
            'academic_score': student.academic_score,
            'predictions': [
                {
                    'risk_score': p.risk_score,
                    'risk_percentage': round(p.risk_score * 100, 2),
                    'risk_tier': classify_risk(p.risk_score),
                    'created_at': p.created_at
                }
                for p in student.predictions
            ],
            'counseling_sessions': [
                {'id': s.id, 'notes': s.notes, 'created_at': s.created_at}
                for s in student.counseling_sessions
            ],
        })

    return jsonify({'students': students_data}), 200
