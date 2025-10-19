from datetime import datetime, timedelta
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(128), unique=True, nullable=True)  # Optional for OTP users
    email = db.Column(db.String(150), unique=True, nullable=False)
    password_hash = db.Column(db.String(256), nullable=True)  # Can be null if OTP login only
    role = db.Column(db.Enum('student', 'teacher', 'admin', name='user_roles'), default='student', nullable=False)
    verified = db.Column(db.Boolean, default=False)
    otp_code = db.Column(db.String(6), nullable=True)
    otp_expiry = db.Column(db.DateTime, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationships
    student_profile = db.relationship("Student", uselist=False, back_populates="user")
    counseling_sessions = db.relationship("CounselingSession", back_populates="teacher")

    # ---------------- PASSWORD METHODS ----------------
    def set_password(self, password: str):
        self.password_hash = generate_password_hash(password)
        db.session.commit()

    def check_password(self, password: str) -> bool:
        if not self.password_hash:
            return False
        return check_password_hash(self.password_hash, password)

    # ---------------- OTP METHODS ----------------
    def set_otp(self, code, expiry_minutes=5):
        self.otp_code = code
        self.otp_expiry = datetime.utcnow() + timedelta(minutes=expiry_minutes)
        db.session.commit()

    def verify_otp(self, code):
        if self.otp_code == code and self.otp_expiry and datetime.utcnow() < self.otp_expiry:
            self.verified = True
            self.otp_code = None
            self.otp_expiry = None
            db.session.commit()
            return True
        return False


class Student(db.Model):
    __tablename__ = 'students'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    full_name = db.Column(db.String(256))
    grade = db.Column(db.String(50))
    attendance = db.Column(db.Float, default=100.0)
    avg_score = db.Column(db.Float, default=0.0)
    assignments_completed = db.Column(db.Integer, default=0)
    behavior_score = db.Column(db.Integer, default=0)
    additional_info = db.Column(db.Text, nullable=True)

    user = db.relationship("User", back_populates="student_profile")
    predictions = db.relationship("Prediction", back_populates="student")
    counseling_sessions = db.relationship("CounselingSession", back_populates="student")


class Prediction(db.Model):
    __tablename__ = 'predictions'
    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey('students.id'))
    risk_score = db.Column(db.Float)
    model_version = db.Column(db.String(64), default='v0.1')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    student = db.relationship("Student", back_populates="predictions")


class CounselingSession(db.Model):
    __tablename__ = 'counseling_sessions'
    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey('students.id'))
    teacher_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    notes = db.Column(db.Text)
    follow_up_at = db.Column(db.DateTime, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    student = db.relationship("Student", back_populates="counseling_sessions")
    teacher = db.relationship("User", back_populates="counseling_sessions")
