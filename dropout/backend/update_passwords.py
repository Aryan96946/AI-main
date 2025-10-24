# backend/update_passwords.py
from models import db, User
from werkzeug.security import generate_password_hash
import secrets
from app import create_app  # make sure you can create Flask app

app = create_app()  # or however your Flask app is created

with app.app_context():
    users = User.query.all()
    for u in users:
        if not u.password_hash:
            new_pass = secrets.token_urlsafe(8)
            u.password_hash = generate_password_hash(new_pass)
            print(f"Updated {u.username}, password: {new_pass}")
    db.session.commit()
    print("All missing passwords updated!")
