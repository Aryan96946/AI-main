from flask import Blueprint, request, jsonify, current_app
from werkzeug.utils import secure_filename
import os
import tempfile
from functools import wraps
from ..ml.importer import import_csv_file

upload_bp = Blueprint("upload", __name__)

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

@upload_bp.route("/upload_csv", methods=["POST"])
@admin_required
def upload_csv():
    if "file" not in request.files:
        return jsonify({"error": "no file part"}), 400
    f = request.files["file"]
    if f.filename == "":
        return jsonify({"error": "no selected file"}), 400
    filename = secure_filename(f.filename)
    tmpdir = tempfile.mkdtemp(prefix="csvupload_")
    dest = os.path.join(tmpdir, filename)
    f.save(dest)
    try:
        result = import_csv_file(current_app, dest)
    except Exception as e:
        return jsonify({"error": "import failed", "exc": str(e)}), 500
    return jsonify({"status": "ok", "result": result})
