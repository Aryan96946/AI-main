from datetime import datetime, timedelta
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash

db = SQLAlchemy()


class AuditLog(db.Model):
    __tablename__ = 'audit_logs'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, nullable=False)
    action = db.Column(db.String(255))
    target_id = db.Column(db.Integer)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)


class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(128), unique=True, nullable=True)
    email = db.Column(db.String(150), unique=True, nullable=False)
    password_hash = db.Column(db.String(256), nullable=True)
    role = db.Column(db.Enum('student', 'teacher', 'admin', name='user_roles'), default='student', nullable=False)
    verified = db.Column(db.Boolean, default=False)
    otp_code = db.Column(db.String(6), nullable=True)
    otp_expiry = db.Column(db.DateTime, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    student_profile = db.relationship("Student", uselist=False, back_populates="user")
    teacher_details = db.relationship("TeacherDetails", uselist=False, back_populates="user")
    counseling_sessions = db.relationship("CounselingSession", back_populates="teacher")

    # Password methods
    def set_password(self, password: str):
        self.password_hash = generate_password_hash(password)
        db.session.commit()
        self.log_action("set_password", self.id)

    def check_password(self, password: str) -> bool:
        if not self.password_hash:
            return False
        return check_password_hash(self.password_hash, password)

    # OTP methods
    def set_otp(self, code, expiry_minutes=5):
        self.otp_code = code
        self.otp_expiry = datetime.utcnow() + timedelta(minutes=expiry_minutes)
        db.session.commit()
        self.log_action("set_otp", self.id)

    def verify_otp(self, code):
        if self.otp_code == code and self.otp_expiry and datetime.utcnow() < self.otp_expiry:
            self.verified = True
            self.otp_code = None
            self.otp_expiry = None
            db.session.commit()
            self.log_action("verify_otp", self.id)
            return True
        return False

    # Logging
    def log_action(self, action, target_id=None):
        log = AuditLog(user_id=self.id, action=action, target_id=target_id)
        db.session.add(log)
        db.session.commit()


class Student(db.Model):
    __tablename__ = 'students'
    __table_args__ = {'extend_existing': True}

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    full_name = db.Column(db.String(256), nullable=False)
    attendance = db.Column(db.Float, default=100.0)
    avg_score = db.Column(db.Float, default=0.0)
    assignments_completed = db.Column(db.Integer, default=0)
    behavior_score = db.Column(db.Integer, default=0)
    grade = db.Column(db.String(10), nullable=True)
    additional_info = db.Column(db.Text, nullable=True)

    user = db.relationship("User", back_populates="student_profile")
    predictions = db.relationship("Prediction", back_populates="student")
    counseling_sessions = db.relationship("CounselingSession", back_populates="student")

    def log_update(self, user_id, action="update_student"):
        log = AuditLog(user_id=user_id, action=action, target_id=self.id)
        db.session.add(log)
        db.session.commit()


class TeacherDetails(db.Model):
    __tablename__ = 'teacher_details'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    full_name = db.Column(db.String(256), nullable=False)
    employee_id = db.Column(db.String(50), nullable=False)
    subject = db.Column(db.String(100), nullable=False)

    user = db.relationship("User", back_populates="teacher_details")


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
