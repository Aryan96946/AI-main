# backend/app/models.py
from . import db
from datetime import datetime

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(128), unique=True, nullable=False)
    password_hash = db.Column(db.String(256), nullable=False)
    role = db.Column(db.String(32), default='student')  # admin, counselor, student
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # relationship helper
    profiles = db.relationship('StudentProfile', backref='user', lazy=True)
    counseling_sessions = db.relationship('CounselingSession', backref='counselor', lazy=True)

class StudentProfile(db.Model):
    __tablename__ = 'student_profiles'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    name = db.Column(db.String(128))
    age = db.Column(db.Integer)
    attendance_rate = db.Column(db.Float)
    gpa = db.Column(db.Float)
    other_features = db.Column(db.JSON)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    predictions = db.relationship('Prediction', backref='student', lazy=True)
    counseling = db.relationship('CounselingSession', backref='student_profile', lazy=True)

class Prediction(db.Model):
    __tablename__ = 'predictions'
    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey('student_profiles.id'))
    risk_score = db.Column(db.Float)
    risk_label = db.Column(db.String(32))
    model_version = db.Column(db.String(64))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class CounselingSession(db.Model):
    __tablename__ = 'counseling_sessions'
    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey('student_profiles.id'))
    counselor_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    notes = db.Column(db.Text)
    outcome = db.Column(db.String(64))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
