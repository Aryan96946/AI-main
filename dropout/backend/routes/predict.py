from flask import Blueprint, request, jsonify
import joblib
import os
from ml.recommend import get_recommendation

predict_bp = Blueprint('predict', __name__)

MODEL_PATH = "ml/model.pkl"
model = joblib.load(MODEL_PATH) if os.path.exists(MODEL_PATH) else None

@predict_bp.route('/predict', methods=['POST'])
def predict():
    if model is None:
        return jsonify({"error": "Model not found. Please train the model first."}), 500

    data = request.get_json()
    required_fields = ["attendance", "avg_score", "assignments_completed", "behavior_score"]
    missing_fields = [field for field in required_fields if field not in data]

    if missing_fields:
        return jsonify({
            "error": "Missing required fields.",
            "missing_fields": missing_fields
        }), 400

    try:
        features = [[
            float(data['attendance']),
            float(data['avg_score']),
            int(data['assignments_completed']),
            float(data['behavior_score'])
        ]]

        risk_score = model.predict_proba(features)[0][1]
        suggestion = get_recommendation(risk_score)

        return jsonify({
            "risk_score": round(risk_score, 2),
            "recommendation": suggestion
        }), 200

    except Exception as e:
        return jsonify({"error": "Error during prediction.", "details": str(e)}), 500
