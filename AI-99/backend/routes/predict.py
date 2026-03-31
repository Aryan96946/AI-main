from flask import Blueprint, request, jsonify
import joblib
import os
import pandas as pd
import logging
from ml.recommend import get_recommendation
from ml.explain import explain_prediction
from ml.preprocess import clean_data

predict_bp = Blueprint("predict", __name__)

MODEL_PATH = os.getenv("MODEL_PATH", os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "ml", "model.pkl"))
PREPROCESSOR_PATH = os.getenv("PREPROCESSOR_PATH", os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "ml", "preprocess.pkl"))

model = None
preprocessor = None

try:
    loaded_model = joblib.load(MODEL_PATH)
    if loaded_model and hasattr(loaded_model, "named_steps"):
        model = loaded_model
except:
    pass

try:
    loaded_preprocessor = joblib.load(PREPROCESSOR_PATH)
    if loaded_preprocessor and hasattr(loaded_preprocessor, "feature_names_in_"):
        preprocessor = loaded_preprocessor
except:
    pass

def get_expected_features():
    if model and hasattr(model.named_steps["preprocessor"], "feature_names_in_"):
        return list(model.named_steps["preprocessor"].feature_names_in_)

    if preprocessor and hasattr(preprocessor, "feature_names_in_"):
        return list(preprocessor.feature_names_in_)

    raise ValueError("Missing feature names")

def format_and_align(df, expected):
    df = clean_data(df)
    df = df.reindex(columns=expected, fill_value=0)
    for col in expected:
        df[col] = pd.to_numeric(df[col], errors="coerce").fillna(0)
    return df

@predict_bp.route("/predict", methods=["POST"])
def predict():
    if model is None:
        return jsonify({"error": "Model not available"}), 500

    data = request.get_json()
    if not isinstance(data, dict) or not data:
        return jsonify({"error": "Valid JSON object required"}), 400

    try:
        if "age" in data:
            data["age_at_enrollment"] = data["age"]

        defaults = {
            "marital_status": "Married",
            "application_mode": "Distance",
            "application_order": 5,
            "course": "Civil Engineering",
            "attendance_type": "Evening",
            "mother_qualification": "None",
            "father_qualification": "None",
            "curricular_units_1st_sem_grade": 0.0,
            "curricular_units_2nd_sem_grade": 0.0,
            "unemployment_rate": 30.0,
            "inflation_rate": 15.0,
            "gdp": -5.0
        }

        for col, val in defaults.items():
            if col not in data:
                data[col] = val

        expected = get_expected_features()
        df = pd.DataFrame([data])
        df = format_and_align(df, expected)

        X_processed = model.named_steps["preprocessor"].transform(df)
        classifier = model.named_steps["classifier"]

        predicted_label = classifier.predict(X_processed)[0]

        class_to_risk = {
            "Dropout": "High Risk",
            "Enrolled": "Medium Risk",
            "Graduate": "Low Risk"
        }
        class_risk = class_to_risk.get(predicted_label, "Unknown")

        if hasattr(classifier, "predict_proba"):
            prob_array = classifier.predict_proba(X_processed)
            classes = list(classifier.classes_)
            if "Dropout" in classes:
                idx = classes.index("Dropout")
                prob = prob_array[0][idx]
            else:
                prob = 0.5
        else:
            prob = 0.5

        risk_tier = (
            "Very High" if prob >= 0.85 else
            "High" if prob >= 0.70 else
            "Moderate" if prob >= 0.50 else
            "Low" if prob >= 0.30 else
            "Minimal"
        )

        rec = get_recommendation(prob)
        suggestions = [s.strip() for s in rec.split(" – ") if s.strip()]

        expl = explain_prediction(model, df)
        explanation = (
            [] if "error" in expl else
            sorted(
                [{"feature": k, "shap": v} for k, v in expl.items()],
                key=lambda x: abs(x["shap"]),
                reverse=True
            )[:5]
        )

        return jsonify({
            "predicted_class": predicted_label,
            "class_based_risk": class_risk,
            "probability": float(prob),
            "risk_tier": risk_tier,
            "suggestions": suggestions,
            "explanation": explanation
        }), 200

    except Exception as e:
        logging.error(str(e))
        return jsonify({"error": "Prediction failed", "details": str(e)}), 500

@predict_bp.route("/batch_predict", methods=["POST"])
def batch_predict():
    if model is None:
        return jsonify({"error": "Model not available"}), 500

    if "file" not in request.files:
        return jsonify({"error": "No file provided"}), 400

    file = request.files["file"]
    if not file.filename.endswith(".csv"):
        return jsonify({"error": "Only CSV files allowed"}), 400

    if file.content_length and file.content_length > 10 * 1024 * 1024:
        return jsonify({"error": "File too large"}), 400

    try:
        df = pd.read_csv(file.stream)
        if df.empty:
            return jsonify({"error": "CSV is empty"}), 400

        expected = get_expected_features()
        df = format_and_align(df, expected)

        X_processed = model.named_steps["preprocessor"].transform(df)
        classifier = model.named_steps["classifier"]

        if hasattr(classifier, "predict_proba"):
            prob_array = classifier.predict_proba(X_processed)
            classes = list(classifier.classes_)
            if "Dropout" in classes:
                idx = classes.index("Dropout")
                probs = prob_array[:, idx]
            else:
                probs = [0.5] * len(df)
        else:
            probs = [0.5] * len(df)

        results = []
        for p in probs:
            recommendation = get_recommendation(float(p))
            results.append({
                "risk_score": round(float(p), 3),
                "recommendation": recommendation
            })

        return jsonify({"predictions": results, "n": len(results)}), 200

    except Exception as e:
        logging.error(str(e))
        return jsonify({"error": "Batch prediction failed", "details": str(e)}), 500
