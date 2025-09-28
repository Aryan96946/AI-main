from . import db
from datetime import datetime
from sqlalchemy import Enum
import enum
from werkzeug.security import generate_password_hash, check_password_hash

class RoleEnum(enum.Enum):
    admin = "admin"
    student = "student"
    teacher = "teacher"

class User(db.Model):
    __tablename__ = "users"
    id = db.Column(db.Integer, primary_key=True)
    fullname = db.Column(db.String(128), nullable=False)
    email = db.Column(db.String(128), unique=True, nullable=False)
    password_hash = db.Column(db.String(256), nullable=False)
    role = db.Column(db.Enum(RoleEnum), default=RoleEnum.student, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

class StudentProfile(db.Model):
    __tablename__ = "student_profiles"
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), unique=True)
    user = db.relationship("User", backref=db.backref("profile", uselist=False))
    age = db.Column(db.Integer)
    gender = db.Column(db.String(20))
    attendance = db.Column(db.Float, default=100.0)  # percentage
    gpa = db.Column(db.Float, default=0.0)
    assignments_completed = db.Column(db.Integer, default=0)
    warnings = db.Column(db.Integer, default=0)
    notes = db.Column(db.Text)

class CounselingSession(db.Model):
    __tablename__ = "counseling_sessions"
    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey("users.id"))
    teacher_id = db.Column(db.Integer, db.ForeignKey("users.id"))
    notes = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class PredictionRecord(db.Model):
    __tablename__ = "predictions"
    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey("users.id"))
    probability = db.Column(db.Float)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    features = db.Column(db.Text)
