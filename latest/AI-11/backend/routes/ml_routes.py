from flask import Blueprint, request, jsonify
from functools import wraps
import os, joblib
import pandas as pd
from ..ml.cleaner import clean_data

ml_bp = Blueprint("ml", __name__)

MODEL_PATH = os.path.join(os.path.dirname(__file__), "..", "ml", "model.pkl")

def admin_required(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        from flask_jwt_extended import verify_jwt_in_request, get_jwt_identity
        verify_jwt_in_request()
        identity = get_jwt_identity() or {}
        role = (identity.get("role") or "").lower()
        if role not in ("admin", "superuser", "teacher"):
            return jsonify({"msg": "admin role required"}), 403
        return fn(*args, **kwargs)
    return wrapper

def get_expected_features(model):
    if hasattr(model, "named_steps") and "preprocessor" in model.named_steps:
        prep = model.named_steps["preprocessor"]
        if hasattr(prep, "feature_names_in_"):
            return list(prep.feature_names_in_)
    if hasattr(model, "feature_names_in_"):
        return list(model.feature_names_in_)
    return []

@ml_bp.route("/retrain", methods=["POST"])
@admin_required
def retrain():
    from ..ml.train_model import train_and_save
    data = request.get_json(silent=True) or {}
    csv_path = data.get("csv_path")
    if not csv_path:
        csv_path = os.path.join(os.path.dirname(__file__), "..", "ml", "students.csv")
    try:
        train_and_save(csv_path, MODEL_PATH)
    except Exception as e:
        return jsonify({"status": "error", "exc": str(e)}), 500
    return jsonify({"status": "ok", "model_path": str(MODEL_PATH)})

@ml_bp.route("/predict", methods=["POST"])
def predict():
    if not os.path.exists(MODEL_PATH):
        return jsonify({"error": "model not trained"}), 400

    model = joblib.load(MODEL_PATH)

    if request.is_json:
        payload = request.get_json()
        if isinstance(payload, dict):
            df = pd.DataFrame([payload])
        elif isinstance(payload, list):
            df = pd.DataFrame(payload)
        else:
            return jsonify({"error": "invalid json payload"}), 400
    elif "file" in request.files:
        f = request.files["file"]
        df = pd.read_csv(f)
    else:
        return jsonify({"error": "no input provided"}), 400

    try:
        df = clean_data(df)
        expected_features = get_expected_features(model)
        for col in expected_features:
            if col not in df.columns:
                df[col] = 0
        df = df[expected_features]
        if hasattr(model, "predict"):
            preds = model.predict(df)
        else:
            preds = model.named_steps["classifier"].predict(df)
    except Exception as e:
        return jsonify({"error": "prediction failed", "exc": str(e)}), 500

    return jsonify({"predictions": preds.tolist(), "n": len(preds)})
