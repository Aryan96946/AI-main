import sys
from werkzeug.security import generate_password_hash
from app import app, db
from models import User, Student, TeacherDetails

try:
    password_hash = generate_password_hash('123456')
    
    courses = ['Computer Science', 'Information Technology', 'Mechanical Engineering', 'Civil Engineering', 'Electronics']
    application_modes = ['Regular', 'Distance']
    marital_statuses = ['Single', 'Married']
    genders = ['Male', 'Female']
    scholarship_holders = ['0', '1']
    debtors = ['0', '1']
    tuition_fees = ['0', '1']
    
    student_data = [
        {"full_name": "Alex Johnson", "attendance": 5, "avg_score": 25, "assignments_completed": 0, "behavior_score": 1, "grade": "F", "academic_score": 15, "Target": "Dropout"},
        {"full_name": "Sarah Williams", "attendance": 8, "avg_score": 30, "assignments_completed": 1, "behavior_score": 2, "grade": "F", "academic_score": 20, "Target": "Dropout"},
        {"full_name": "Mike Brown", "attendance": 10, "avg_score": 28, "assignments_completed": 0, "behavior_score": 1, "grade": "F", "academic_score": 18, "Target": "Dropout"},
        {"full_name": "Emily Davis", "attendance": 12, "avg_score": 32, "assignments_completed": 1, "behavior_score": 2, "grade": "F", "academic_score": 22, "Target": "Dropout"},
        {"full_name": "Chris Wilson", "attendance": 15, "avg_score": 35, "assignments_completed": 1, "behavior_score": 2, "grade": "D", "academic_score": 25, "Target": "Dropout"},
        {"full_name": "Jessica Miller", "attendance": 18, "avg_score": 33, "assignments_completed": 0, "behavior_score": 1, "grade": "F", "academic_score": 28, "Target": "Dropout"},
        {"full_name": "David Anderson", "attendance": 20, "avg_score": 38, "assignments_completed": 1, "behavior_score": 2, "grade": "D", "academic_score": 30, "Target": "Dropout"},
        {"full_name": "Ashley Thomas", "attendance": 22, "avg_score": 35, "assignments_completed": 1, "behavior_score": 2, "grade": "D", "academic_score": 32, "Target": "Dropout"},
        {"full_name": "Daniel Martinez", "attendance": 25, "avg_score": 40, "assignments_completed": 2, "behavior_score": 3, "grade": "D", "academic_score": 35, "Target": "Dropout"},
        {"full_name": "Nicole Garcia", "attendance": 28, "avg_score": 38, "assignments_completed": 1, "behavior_score": 2, "grade": "D", "academic_score": 33, "Target": "Dropout"},
        {"full_name": "Ryan Robinson", "attendance": 55, "avg_score": 58, "assignments_completed": 3, "behavior_score": 5, "grade": "C", "academic_score": 55, "Target": "Enrolled"},
        {"full_name": "Laura Hernandez", "attendance": 58, "avg_score": 60, "assignments_completed": 3, "behavior_score": 5, "grade": "C", "academic_score": 58, "Target": "Enrolled"},
        {"full_name": "Kevin Lopez", "attendance": 60, "avg_score": 62, "assignments_completed": 4, "behavior_score": 6, "grade": "C", "academic_score": 60, "Target": "Enrolled"},
        {"full_name": "Michelle Gonzalez", "attendance": 62, "avg_score": 58, "assignments_completed": 3, "behavior_score": 5, "grade": "C", "academic_score": 56, "Target": "Enrolled"},
        {"full_name": "Brian Wilson", "attendance": 65, "avg_score": 64, "assignments_completed": 4, "behavior_score": 6, "grade": "C", "academic_score": 62, "Target": "Enrolled"},
        {"full_name": "Stephanie Moore", "attendance": 68, "avg_score": 66, "assignments_completed": 4, "behavior_score": 6, "grade": "C", "academic_score": 65, "Target": "Enrolled"},
        {"full_name": "Jason Taylor", "attendance": 70, "avg_score": 68, "assignments_completed": 5, "behavior_score": 7, "grade": "C", "academic_score": 68, "Target": "Enrolled"},
        {"full_name": "Amanda Jackson", "attendance": 72, "avg_score": 65, "assignments_completed": 4, "behavior_score": 6, "grade": "C", "academic_score": 64, "Target": "Enrolled"},
        {"full_name": "Timothy White", "attendance": 75, "avg_score": 70, "assignments_completed": 5, "behavior_score": 7, "grade": "C", "academic_score": 70, "Target": "Enrolled"},
        {"full_name": "Melissa Harris", "attendance": 78, "avg_score": 72, "assignments_completed": 5, "behavior_score": 7, "grade": "B", "academic_score": 72, "Target": "Enrolled"},
        {"full_name": "Jennifer Martin", "attendance": 85, "avg_score": 80, "assignments_completed": 6, "behavior_score": 8, "grade": "B", "academic_score": 80, "Target": "Graduate"},
        {"full_name": "Matthew Thompson", "attendance": 88, "avg_score": 82, "assignments_completed": 7, "behavior_score": 9, "grade": "A", "academic_score": 85, "Target": "Graduate"},
        {"full_name": "Kimberly Garcia", "attendance": 90, "avg_score": 85, "assignments_completed": 7, "behavior_score": 9, "grade": "A", "academic_score": 88, "Target": "Graduate"},
        {"full_name": "Joshua Martinez", "attendance": 92, "avg_score": 87, "assignments_completed": 8, "behavior_score": 10, "grade": "A", "academic_score": 90, "Target": "Graduate"},
        {"full_name": "Heather Robinson", "attendance": 94, "avg_score": 88, "assignments_completed": 8, "behavior_score": 10, "grade": "A", "academic_score": 92, "Target": "Graduate"},
        {"full_name": "Andrew Clark", "attendance": 95, "avg_score": 90, "assignments_completed": 9, "behavior_score": 10, "grade": "A+", "academic_score": 94, "Target": "Graduate"},
        {"full_name": "Christina Rodriguez", "attendance": 96, "avg_score": 91, "assignments_completed": 9, "behavior_score": 10, "grade": "A+", "academic_score": 95, "Target": "Graduate"},
        {"full_name": "Joseph Lee", "attendance": 97, "avg_score": 92, "assignments_completed": 10, "behavior_score": 10, "grade": "A+", "academic_score": 96, "Target": "Graduate"},
        {"full_name": "Rebecca Walker", "attendance": 98, "avg_score": 93, "assignments_completed": 10, "behavior_score": 10, "grade": "A+", "academic_score": 97, "Target": "Graduate"},
        {"full_name": "Justin Hall", "attendance": 99, "avg_score": 95, "assignments_completed": 10, "behavior_score": 10, "grade": "A+", "academic_score": 99, "Target": "Graduate"},
        {"full_name": "Samantha Allen", "attendance": 45, "avg_score": 48, "assignments_completed": 2, "behavior_score": 4, "grade": "D", "academic_score": 45, "Target": "Enrolled"},
        {"full_name": "Brandon Young", "attendance": 50, "avg_score": 52, "assignments_completed": 2, "behavior_score": 4, "grade": "C", "academic_score": 50, "Target": "Enrolled"},
        {"full_name": "Kayla King", "attendance": 35, "avg_score": 42, "assignments_completed": 1, "behavior_score": 3, "grade": "D", "academic_score": 38, "Target": "Dropout"},
        {"full_name": "Austin Wright", "attendance": 40, "avg_score": 45, "assignments_completed": 2, "behavior_score": 3, "grade": "D", "academic_score": 42, "Target": "Dropout"},
        {"full_name": "Brittany Scott", "attendance": 80, "avg_score": 78, "assignments_completed": 5, "behavior_score": 7, "grade": "B", "academic_score": 78, "Target": "Graduate"},
        {"full_name": "Tyler Green", "attendance": 82, "avg_score": 76, "assignments_completed": 5, "behavior_score": 7, "grade": "B", "academic_score": 76, "Target": "Graduate"},
        {"full_name": "Hannah Baker", "attendance": 75, "avg_score": 71, "assignments_completed": 4, "behavior_score": 6, "grade": "B", "academic_score": 71, "Target": "Enrolled"},
        {"full_name": "Jordan Adams", "attendance": 30, "avg_score": 36, "assignments_completed": 1, "behavior_score": 2, "grade": "F", "academic_score": 32, "Target": "Dropout"},
        {"full_name": "Taylor Nelson", "attendance": 55, "avg_score": 56, "assignments_completed": 3, "behavior_score": 5, "grade": "C", "academic_score": 54, "Target": "Enrolled"},
        {"full_name": "Dylan Carter", "attendance": 88, "avg_score": 84, "assignments_completed": 7, "behavior_score": 9, "grade": "A", "academic_score": 86, "Target": "Graduate"},
        {"full_name": "Morgan Mitchell", "attendance": 92, "avg_score": 86, "assignments_completed": 8, "behavior_score": 9, "grade": "A", "academic_score": 89, "Target": "Graduate"},
        {"full_name": "Casey Perez", "attendance": 48, "avg_score": 50, "assignments_completed": 2, "behavior_score": 4, "grade": "C", "academic_score": 48, "Target": "Enrolled"},
        {"full_name": "Riley Roberts", "attendance": 25, "avg_score": 28, "assignments_completed": 0, "behavior_score": 1, "grade": "F", "academic_score": 24, "Target": "Dropout"},
        {"full_name": "Avery Turner", "attendance": 78, "avg_score": 74, "assignments_completed": 5, "behavior_score": 7, "grade": "B", "academic_score": 74, "Target": "Graduate"},
        {"full_name": "Quinn Phillips", "attendance": 85, "avg_score": 81, "assignments_completed": 6, "behavior_score": 8, "grade": "B", "academic_score": 82, "Target": "Graduate"},
        {"full_name": "Parker Campbell", "attendance": 60, "avg_score": 63, "assignments_completed": 3, "behavior_score": 5, "grade": "C", "academic_score": 61, "Target": "Enrolled"},
        {"full_name": "Hayden Parker", "attendance": 35, "avg_score": 40, "assignments_completed": 1, "behavior_score": 2, "grade": "F", "academic_score": 36, "Target": "Dropout"},
        {"full_name": "Cameron Evans", "attendance": 95, "avg_score": 89, "assignments_completed": 8, "behavior_score": 10, "grade": "A+", "academic_score": 91, "Target": "Graduate"},
        {"full_name": "Jordan Edwards", "attendance": 90, "avg_score": 83, "assignments_completed": 7, "behavior_score": 8, "grade": "A", "academic_score": 84, "Target": "Graduate"},
        {"full_name": "Sage Collins", "attendance": 65, "avg_score": 67, "assignments_completed": 4, "behavior_score": 6, "grade": "C", "academic_score": 66, "Target": "Enrolled"},
        {"full_name": "Reese Stewart", "attendance": 42, "avg_score": 46, "assignments_completed": 2, "behavior_score": 3, "grade": "D", "academic_score": 44, "Target": "Dropout"},
    ]
    
    with app.app_context():
        student_count = 0
        for i, data in enumerate(student_data):
            username = f"student{i+1}@example.com"
            email = f"student{i+1}@example.com"
            
            existing_user = User.query.filter_by(username=username).first()
            if existing_user:
                print(f"User {username} already exists, skipping...")
                continue
                
            user = User(
                username=username,
                email=email,
                password_hash=password_hash,
                role='student',
                verified=True
            )
            db.session.add(user)
            db.session.flush()
            
            student = Student(
                student_id=f"STU{str(i+51).zfill(3)}",
                user_id=user.id,
                full_name=data['full_name'],
                attendance=data['attendance'],
                avg_score=data['avg_score'],
                assignments_completed=data['assignments_completed'],
                behavior_score=data['behavior_score'],
                grade=data['grade'],
                academic_score=data['academic_score'],
                course=courses[i % len(courses)],
                application_mode=application_modes[i % len(application_modes)],
                marital_status=marital_statuses[i % len(marital_statuses)],
                gender=genders[i % len(genders)],
                age_at_enrollment=18 + (i % 10),
                scholarship_holder=scholarship_holders[i % len(scholarship_holders)],
                debtor=debtors[i % len(debtors)],
                tuition_fees_up_to_date=tuition_fees[i % len(tuition_fees)],
                cu1_enrolled=1,
                cu1_approved=1 if data['academic_score'] >= 50 else 0,
                cu1_grade=data['avg_score'] - 5,
                cu2_enrolled=1,
                cu2_approved=1 if data['academic_score'] >= 50 else 0,
                cu2_grade=data['avg_score'] - 8,
            )
            db.session.add(student)
            student_count += 1
        
        # Add 10 teachers
        teacher_names = [
            "Dr. John Smith", "Prof. Mary Johnson", "Dr. Robert Williams", 
            "Prof. Patricia Brown", "Dr. Michael Davis", "Prof. Linda Miller",
            "Dr. James Wilson", "Prof. Barbara Moore", "Dr. David Taylor", "Prof. Susan Anderson"
        ]
        subjects = ["Mathematics", "Physics", "Chemistry", "Biology", "English", "Computer Science", "History", "Economics", "Psychology", "Philosophy"]
        departments = ["Science", "Engineering", "Arts", "Commerce", "Mathematics"]
        
        teacher_count = 0
        for i in range(10):
            username = f"teacher{i+1}@example.com"
            email = f"teacher{i+1}@example.com"
            
            existing_user = User.query.filter_by(username=username).first()
            if existing_user:
                print(f"Teacher {username} already exists, skipping...")
                continue
                
            user = User(
                username=username,
                email=email,
                password_hash=password_hash,
                role='teacher',
                verified=True
            )
            db.session.add(user)
            db.session.flush()
            
            teacher_detail = TeacherDetails(
                user_id=user.id,
                full_name=teacher_names[i],
                employee_id=f"EMP{str(i+1).zfill(3)}",
                subject=subjects[i],
                department=departments[i % len(departments)]
            )
            db.session.add(teacher_detail)
            teacher_count += 1
        
        db.session.commit()
        print(f"SUCCESS: Added {student_count} students and {teacher_count} teachers!")
except Exception as e:
    print(f"ERROR: {e}")
    import traceback
    traceback.print_exc()

