import json
from flask import current_app
import joblib

def load_model():
    path = current_app.config.get("MODEL_PATH")
    try:
        model = joblib.load(path)
        return model
    except Exception as e:
        current_app.logger.warning("Model load failed: %s", e)
        return None

def features_to_array(payload):
    # expects keys: attendance, gpa, assignments_completed, warnings, age
    arr = [
        float(payload.get("attendance", 0.0)),
        float(payload.get("gpa", 0.0)),
        float(payload.get("assignments_completed", 0)),
        float(payload.get("warnings", 0)),
        float(payload.get("age", 0)),
    ]
    return arr
