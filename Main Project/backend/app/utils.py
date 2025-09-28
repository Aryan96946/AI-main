# backend/app/utils.py
from functools import wraps
from flask_jwt_extended import verify_jwt_in_request, get_jwt_identity
from flask import jsonify

def roles_required(*roles):
    def wrapper(fn):
        @wraps(fn)
        def decorator(*args, **kwargs):
            verify_jwt_in_request()
            identity = get_jwt_identity()
            role = identity.get('role') if isinstance(identity, dict) else None
            if role not in roles:
                return jsonify({'msg': 'forbidden'}), 403
            return fn(*args, **kwargs)
        return decorator
    return wrapper
