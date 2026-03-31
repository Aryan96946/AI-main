from flask import current_app
import os
import sys
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app import create_app
from models import db, User, Student, TeacherDetails
import random
from werkzeug.security import generate_password_hash
from sqlalchemy.exc import IntegrityError

# Configuration
STUDENT_COUNT = 250
TEACHER_COUNT = 75
DEFAULT_PASSWORD = '123456'
BATCH_SIZE = 100  # optimized

# Generate password hash once (performance boost)
HASHED_PASSWORD = generate_password_hash(DEFAULT_PASSWORD)

# Fixed data lists
FIRST_NAMES = ['John', 'Michael', 'David', 'James', 'Robert', 'William', 'Thomas',
               'Charles', 'Christopher', 'Daniel', 'Mary', 'Patricia', 'Jennifer',
               'Linda', 'Elizabeth']

LAST_NAMES = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones',
              'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez']

COURSES = [
    'Computer Science', 'Mathematics', 'Physics', 'Biology', 'Chemistry',
    'Engineering', 'Economics', 'Business Administration', 'Psychology', 'Nursing'
]

SUBJECTS = [
    'Mathematics', 'Physics', 'Chemistry', 'Biology', 'Computer Science',
    'English', 'History', 'Economics', 'Statistics', 'Calculus'
]

DEPARTMENTS = ['Science', 'Engineering', 'Arts', 'Business', 'Health Sciences']
GENDERS = ['Male', 'Female']
MARITAL_STATUSES = ['Single', 'Married']
APPLICATION_MODES = ['Regular', 'Transfer', 'International']
GRADES = ['A', 'B', 'C', 'D', 'F']


# -------------------- STUDENT DATA --------------------
STUDENT_DATA = []

for i in range(STUDENT_COUNT):
    rng = random.Random(i)

    fname = rng.choice(FIRST_NAMES)
    lname = rng.choice(LAST_NAMES)
    full_name = f"{fname} {lname}"

    course = COURSES[i % len(COURSES)]
    gender = GENDERS[i % 2]
    marital = MARITAL_STATUSES[i % 2]
    app_mode = APPLICATION_MODES[i % 3]
    age = 18 + (i % 8)

    attendance = round(rng.uniform(65, 98), 1)
    avg_score = round(rng.uniform(55, 92), 1)
    academic_score = rng.randint(45, 98)

    cu1_enrolled = rng.randint(4, 7)
    cu1_approved = rng.randint(cu1_enrolled - 1, cu1_enrolled)

    cu2_enrolled = rng.randint(4, 7)
    cu2_approved = rng.randint(cu2_enrolled - 1, cu2_enrolled)

    cu1_grade = round(rng.uniform(10, 17), 1)
    cu2_grade = round(rng.uniform(10, 17), 1)

    grade = rng.choice(GRADES)
    assignments = rng.randint(5, 18)
    behavior = round(rng.uniform(75, 98), 1)

    # FIXED: boolean fields
    scholarship = 1 if i % 7 == 0 else 0
    debtor = 1 if i % 11 == 0 else 0
    tuition = 0 if i % 13 == 0 else 1

    STUDENT_DATA.append({
        'full_name': full_name,
        'course': course,
        'gender': gender,
        'marital_status': marital,
        'application_mode': app_mode,
        'age_at_enrollment': age,
        'scholarship_holder': scholarship,
        'debtor': debtor,
        'tuition_fees_up_to_date': tuition,
        'cu1_enrolled': cu1_enrolled,
        'cu1_approved': cu1_approved,
        'cu1_grade': cu1_grade,
        'cu2_enrolled': cu2_enrolled,
        'cu2_approved': cu2_approved,
        'cu2_grade': cu2_grade,
        'attendance': attendance,
        'avg_score': avg_score,
        'grade': grade,
        'academic_score': academic_score,
        'assignments_completed': assignments,
        'behavior_score': behavior
    })


# -------------------- TEACHER DATA --------------------
TEACHER_DATA = []

for i in range(TEACHER_COUNT):
    rng = random.Random(i + 1000)

    fname = rng.choice(FIRST_NAMES)
    lname = rng.choice(LAST_NAMES)
    full_name = f"{fname} {lname}"

    TEACHER_DATA.append({
        'full_name': full_name,
        'subject': SUBJECTS[i % len(SUBJECTS)],
        'department': DEPARTMENTS[i % len(DEPARTMENTS)]
    })


# -------------------- APP CONTEXT --------------------
def create_app_context():
    app = create_app()
    app.app_context().push()
    return app


# -------------------- CREATE STUDENT --------------------
def create_student(num):
    idx = num - 1
    if idx >= len(STUDENT_DATA):
        return False

    username = f"student{num:04d}"
    email = f"{username}@school.edu"

    try:
        # Avoid duplicates
        if User.query.filter_by(email=email).first():
            print(f"⚠️ Skipped existing {email}")
            return False

        user = User(
            username=username,
            email=email,
            role='student',
            verified=True
        )
        user.password_hash = HASHED_PASSWORD

        db.session.add(user)
        db.session.flush()

        student = Student(
            student_id=f"STU{num:04d}",
            user_id=user.id,
            additional_info="Seeded data",
            **STUDENT_DATA[idx]
        )

        db.session.add(student)

        print(f"✅ Student {num} created")
        return True

    except Exception as e:
        db.session.rollback()
        print(f"❌ Student {num} error: {e}")
        return False


# -------------------- CREATE TEACHER --------------------
def create_teacher(num):
    idx = num - 1
    if idx >= len(TEACHER_DATA):
        return False

    username = f"teacher{num:04d}"
    email = f"{username}@school.edu"

    try:
        if User.query.filter_by(email=email).first():
            print(f"⚠️ Skipped existing {email}")
            return False

        user = User(
            username=username,
            email=email,
            role='teacher',
            verified=True
        )
        user.password_hash = HASHED_PASSWORD

        db.session.add(user)
        db.session.flush()

        teacher = TeacherDetails(
            user_id=user.id,
            employee_id=f"EMP{num:04d}",
            full_name=TEACHER_DATA[idx]['full_name'],
            subject=TEACHER_DATA[idx]['subject'],
            department=TEACHER_DATA[idx]['department']
        )

        db.session.add(teacher)

        print(f"✅ Teacher {num} created")
        return True

    except Exception as e:
        db.session.rollback()
        print(f"❌ Teacher {num} error: {e}")
        return False


# -------------------- MAIN --------------------
def main():
    create_app_context()

    print("🌱 Seeding database...\n")

    student_added = 0
    teacher_added = 0

    # Students
    for i in range(1, STUDENT_COUNT + 1):
        if create_student(i):
            student_added += 1

        if i % BATCH_SIZE == 0:
            db.session.commit()
            print(f"💾 Students committed at {i}")

    db.session.commit()

    # Teachers
    for i in range(1, TEACHER_COUNT + 1):
        if create_teacher(i):
            teacher_added += 1

        if i % BATCH_SIZE == 0 or i == TEACHER_COUNT:
            db.session.commit()
            print(f"💾 Teachers committed at {i}")

    print("\n" + "=" * 50)
    print("✅ DONE")
    print(f"Students: {student_added}")
    print(f"Teachers: {teacher_added}")
    print("=" * 50)

    print("\n🔑 Login:")
    print("email: student0001@school.edu")
    print(f"password: {DEFAULT_PASSWORD}")


# -------------------- RUN --------------------
if __name__ == "__main__":
    main()