from flask import Blueprint, request, jsonify
from functools import wraps
import os, joblib
import pandas as pd
from ..ml.preprocess import clean_data
from ..ml.explain import explain_prediction
from ..ml.recommend import get_recommendation

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

    # Map frontend fields to model fields
    if "age" in df.columns:
        df["age_at_enrollment"] = df["age"]
    # previous_qualification is already correct

    # Set default values for missing features to allow varied predictions
    defaults = {
        "marital_status": "Single",
        "application_mode": "Regular",
        "application_order": 1,
        "course": "Computer Science",
        "attendance_type": "Daytime",
        "mother_qualification": "High School",
        "father_qualification": "High School",
        "curricular_units_1st_sem_grade": 12.0,
        "curricular_units_2nd_sem_grade": 12.0,
        "unemployment_rate": 10.0,
        "inflation_rate": 2.0,
        "gdp": 1.5
    }
    for col, val in defaults.items():
        if col not in df.columns:
            df[col] = val

    try:
        df = clean_data(df)
        expected_features = get_expected_features(model)
        for col in expected_features:
            if col not in df.columns:
                df[col] = 0
        df = df[expected_features]

        if not hasattr(model, "predict_proba"):
            return jsonify({"error": "model does not support probability prediction"}), 400

        probas = model.predict_proba(df)
        preds = model.predict(df)

        # Assume classes are ["Dropout", "Enrolled", "Graduate"], Dropout is risk
        classes = model.named_steps["classifier"].classes_
        if "Dropout" not in classes:
            return jsonify({"error": "model does not have 'Dropout' class"}), 400
        dropout_idx = list(classes).index("Dropout")

        results = []
        for i, row in df.iterrows():
            prob = probas[i][dropout_idx]
            risk_tier = (
                "Very High" if prob >= 0.85 else
                "High" if prob >= 0.70 else
                "Moderate" if prob >= 0.50 else
                "Low" if prob >= 0.30 else
                "Minimal"
            )
            rec = get_recommendation(prob)
            suggestions = [s.strip() for s in rec.split(" – ") if s.strip()]
            expl = explain_prediction(model, row)
            if "error" in expl:
                explanation = []
            else:
                explanation = sorted(
                    [{"feature": k, "shap": v} for k, v in expl.items()],
                    key=lambda x: abs(x["shap"]),
                    reverse=True
                )[:5]  # top 5

            results.append({
                "risk_tier": risk_tier,
                "probability": prob,
                "suggestions": suggestions,
                "explanation": explanation
            })

    except Exception as e:
        return jsonify({"error": "prediction failed", "exc": str(e)}), 500

    if len(results) == 1:
        return jsonify(results[0])
    else:
        return jsonify({"predictions": results, "n": len(results)})
