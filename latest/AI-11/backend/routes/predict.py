from flask import Blueprint, request, jsonify
import joblib, os
import pandas as pd
from ml.recommend import get_recommendation
from ml.explain import explain_prediction
from ml.preprocess import clean_data

predict_bp = Blueprint("predict", __name__)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "..", "ml", "model.pkl")
PREPROCESSOR_PATH = os.path.join(BASE_DIR, "..", "ml", "preprocessor.pkl")

try:
    model = joblib.load(MODEL_PATH)
except Exception:
    model = None

try:
    preprocessor = joblib.load(PREPROCESSOR_PATH)
except Exception:
    preprocessor = None


def get_expected_features():
    if hasattr(model, "named_steps") and "preprocessor" in model.named_steps:
        prep = model.named_steps["preprocessor"]
        if hasattr(prep, "feature_names_in_") and prep.feature_names_in_ is not None:
            return list(prep.feature_names_in_)

    if preprocessor and hasattr(preprocessor, "feature_names_in_") and preprocessor.feature_names_in_ is not None:
        return list(preprocessor.feature_names_in_)

    raise ValueError("Model preprocessor has no feature_names_in_. Retrain your model.")


def format_and_align(df, expected):
    df = clean_data(df)
    df = df.reindex(columns=expected, fill_value=0)
    for col in expected:
        df[col] = pd.to_numeric(df[col], errors="ignore")
    return df


@predict_bp.route("/predict", methods=["POST"])
def predict():
    if model is None:
        return jsonify({"error": "Model missing"}), 500

    data = request.get_json()
    if not isinstance(data, dict):
        return jsonify({"error": "JSON object expected"}), 400

    try:
        expected = get_expected_features()
        df = pd.DataFrame([data])
        df = format_and_align(df, expected)

        X_processed = model.named_steps["preprocessor"].transform(df)

        if hasattr(model.named_steps["classifier"], "predict_proba"):
            prob = float(model.named_steps["classifier"].predict_proba(X_processed)[0][1])
        else:
            prob = float(model.named_steps["classifier"].predict(X_processed)[0])

        return jsonify({
            "risk_score": round(prob, 3),
            "recommendation": get_recommendation(prob),
            "explanation": explain_prediction(model, df),
        }), 200

    except Exception as e:
        return jsonify({"error": "Prediction failed", "details": str(e)}), 500


@predict_bp.route("/batch_predict", methods=["POST"])
def batch_predict():
    if model is None:
        return jsonify({"error": "Model missing"}), 500

    if "file" not in request.files:
        return jsonify({"error": "No file provided"}), 400

    try:
        df = pd.read_csv(request.files["file"])

        expected = get_expected_features()
        df = format_and_align(df, expected)

        X_processed = model.named_steps["preprocessor"].transform(df)

        classifier = model.named_steps["classifier"]
        if hasattr(classifier, "predict_proba"):
            probs = classifier.predict_proba(X_processed)[:, 1]
        else:
            probs = classifier.predict(X_processed)

        results = [{
            "risk_score": round(float(p), 3),
            "recommendation": get_recommendation(p)
        } for p in probs]

        return jsonify({"predictions": results, "n": len(results)}), 200

    except Exception as e:
        return jsonify({"error": "Batch prediction failed", "details": str(e)}), 500
