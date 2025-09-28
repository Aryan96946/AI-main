from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from .utils import load_model, features_to_array
from . import db
from .models import PredictionRecord, User
import json

predict_bp = Blueprint("predict", __name__)

@predict_bp.route("/dropout", methods=["POST"])
@jwt_required()
def predict_dropout():
    identity = get_jwt_identity()
    user_id = identity["id"]
    data = request.get_json() or {}
    model = load_model()
    if not model:
        return jsonify({"error": "Model not available; contact admin"}), 500
    features = features_to_array(data)
    import numpy as np
    prob = float(model.predict_proba([features])[0][1])  # assume [[prob0, prob1]]
    # Save
    rec = PredictionRecord(student_id=data.get("student_id", user_id), probability=prob, features=json.dumps(data))
    db.session.add(rec)
    db.session.commit()
    advice = "Low risk" if prob < 0.4 else "Medium risk" if prob < 0.7 else "High risk"
    return jsonify({"probability": prob, "advice": advice})

@predict_bp.route("/history/<int:student_id>", methods=["GET"])
@jwt_required()
def prediction_history(student_id):
    # anyone logged in can fetch their history; teachers/admins can fetch any
    identity = get_jwt_identity()
    if identity["role"] == "student" and identity["id"] != student_id:
        return jsonify({"error": "Forbidden"}), 403
    recs = PredictionRecord.query.filter_by(student_id=student_id).order_by(PredictionRecord.created_at.desc()).limit(50).all()
    out = [{"id": r.id, "probability": r.probability, "created_at": r.created_at.isoformat(), "features": r.features} for r in recs]
    return jsonify(out)
