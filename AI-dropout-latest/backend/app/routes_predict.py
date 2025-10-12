from flask import Blueprint, request, jsonify
from joblib import load
import numpy as np
import pandas as pd
from .models import User
from . import db
from flask_jwt_extended import jwt_required, get_jwt_identity

predict_bp = Blueprint('predict', __name__)

# load model once
MODEL_PATH = "model/dropout_model.joblib"
try:
    model = load(MODEL_PATH)
except Exception:
    model = None

# Example: accept student features and return risk and chart data
@predict_bp.route('/student', methods=['POST'])
@jwt_required()
def predict_student():
    ident = get_jwt_identity()
    body = request.get_json()
    # expected features example: attendance_percent, gpa, assignments_completed, engagement_score
    features = [
        float(body.get('attendance_percent', 0)),
        float(body.get('gpa', 0)),
        float(body.get('assignments_completed', 0)),
        float(body.get('engagement_score', 0))
    ]
    X = np.array(features).reshape(1, -1)
    if model is None:
        return jsonify({"msg": "Model not available"}), 500
    prob = model.predict_proba(X)[0].tolist()  # [prob_neg, prob_pos] or similar depending on model
    pred = int(model.predict(X)[0])
    # Build chart data (e.g., risk breakdown)
    chart = {
        "labels": ["No Dropout Risk", "Dropout Risk"],
        "data": [round(prob[0]*100,2), round(prob[1]*100,2)]
    }
    # Also provide a table-like breakdown
    table = {
        "features": ["attendance_percent","gpa","assignments_completed","engagement_score"],
        "values": features
    }
    return jsonify({"prediction": pred, "probabilities": prob, "chart": chart, "table": table}), 200
