# backend/app/routes_predict.py
import os
import joblib
from flask import Blueprint, request, jsonify, current_app
from .models import Prediction, StudentProfile
from . import db
from .utils import roles_required
from marshmallow import ValidationError
from .schemas import PredictSchema

predict_bp = Blueprint('predict', __name__)

MODEL_PATH = os.environ.get('MODEL_PATH', '/app/model/latest_model.joblib')

# attempt to lazy-load model
def load_model():
    try:
        model = joblib.load(MODEL_PATH)
        return model
    except Exception as e:
        current_app.logger.warning(f"Could not load model at {MODEL_PATH}: {e}")
        return None

# cached in-memory (module-level) model for faster repeated calls
_model = None
def get_model():
    global _model
    if _model is None:
        _model = load_model()
    return _model

@predict_bp.route('/risk', methods=['POST'])
@roles_required('admin', 'counselor')
def risk_predict():
    data = request.get_json() or {}
    try:
        validated = PredictSchema().load(data)
    except ValidationError as e:
        return jsonify({'msg': 'invalid input', 'errors': e.messages}), 400

    student_id = validated['student_id']
    features = validated['features']

    student = StudentProfile.query.get(student_id)
    if student is None:
        return jsonify({'msg': 'student not found'}), 404

    model = get_model()
    if model is None:
        return jsonify({'msg': 'model not available'}), 500

    # If the model expects a vector, the frontend must supply features in the correct format.
    try:
        X = [features]  # joblib pipeline that knows how to transform dicts is ideal
        # If model has predict_proba
        if hasattr(model, 'predict_proba'):
            prob = float(model.predict_proba(X)[0][1])
        else:
            # fallback to predict output scaled
            pred = float(model.predict(X)[0])
            prob = pred
        label = 'high' if prob >= 0.5 else 'low'
    except Exception as e:
        current_app.logger.exception("Prediction failed")
        return jsonify({'msg': 'prediction failed', 'error': str(e)}), 500

    pr = Prediction(student_id=student_id, risk_score=prob, risk_label=label, model_version=os.environ.get('MODEL_VERSION','v1'))
    db.session.add(pr)
    db.session.commit()

    return jsonify({'risk_score': prob, 'risk_label': label})
