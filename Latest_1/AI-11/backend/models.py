from datetime import datetime, timedelta
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash

db = SQLAlchemy()


class RawStudent(db.Model):
    __tablename__ = 'raw_students'

    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.String(50))
    data = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)


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

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)
        db.session.add(self)
        self.log_action("set_password", self.id)

    def check_password(self, password: str) -> bool:
        return check_password_hash(self.password_hash, password) if self.password_hash else False

    def set_otp(self, code, expiry_minutes=5):
        self.otp_code = code
        self.otp_expiry = datetime.utcnow() + timedelta(minutes=expiry_minutes)
        db.session.add(self)
        self.log_action("set_otp", self.id)

    def verify_otp(self, code):
        if self.otp_code == code and self.otp_expiry and datetime.utcnow() < self.otp_expiry:
            self.verified = True
            self.otp_code = None
            self.otp_expiry = None
            db.session.add(self)
            self.log_action("verify_otp", self.id)
            return True
        return False

    def log_action(self, action, target_id=None):
        log = AuditLog(user_id=self.id, action=action, target_id=target_id)
        db.session.add(log)


class Student(db.Model):
    __tablename__ = 'students'
    __table_args__ = {'extend_existing': True}

    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.String(50), unique=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    full_name = db.Column(db.String(256), nullable=False)
    assignments_completed = db.Column(db.Integer, default=0) 
    behavior_score = db.Column(db.Float, default=0.0)

    course = db.Column(db.String(100))
    gender = db.Column(db.String(10))
    marital_status = db.Column(db.String(50))
    application_mode = db.Column(db.String(50))
    age_at_enrollment = db.Column(db.Integer)
    scholarship_holder = db.Column(db.String(10))
    debtor = db.Column(db.String(10))
    tuition_fees_up_to_date = db.Column(db.String(10))

    cu1_enrolled = db.Column(db.Integer)
    cu1_approved = db.Column(db.Integer)
    cu1_grade = db.Column(db.Float)

    cu2_enrolled = db.Column(db.Integer)
    cu2_approved = db.Column(db.Integer)
    cu2_grade = db.Column(db.Float)

    attendance = db.Column(db.Float)
    avg_score = db.Column(db.Float)
    grade = db.Column(db.String(10))
    additional_info = db.Column(db.Text)
    academic_score = db.Column(db.Integer)
    user = db.relationship("User", back_populates="student_profile")
    predictions = db.relationship('Prediction', backref='student', lazy=True)
    counseling_sessions = db.relationship('CounselingSession', backref='student', lazy=True)


    def log_update(self, user_id, action="update_student"):
        log = AuditLog(user_id=user_id, action=action, target_id=self.id)
        db.session.add(log)


class TeacherDetails(db.Model):
    __tablename__ = 'teacher_details'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    full_name = db.Column(db.String(256), nullable=False)
    employee_id = db.Column(db.String(50), nullable=False)
    subject = db.Column(db.String(100), nullable=False)
    department = db.Column(db.String(100), nullable=False)

    user = db.relationship("User", back_populates="teacher_details")


class Prediction(db.Model):
    __tablename__ = 'predictions'

    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey('students.id'))
    risk_score = db.Column(db.Float)
    model_version = db.Column(db.String(64), default='v0.1')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)


class CounselingSession(db.Model):
    __tablename__ = 'counseling_sessions'

    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey('students.id'))
    teacher_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    notes = db.Column(db.Text)
    follow_up_at = db.Column(db.DateTime, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    teacher = db.relationship("User", back_populates="counseling_sessions")
