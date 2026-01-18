from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker, scoped_session
from werkzeug.security import generate_password_hash

# Use local connection string for running outside Docker
LOCAL_DATABASE_URI = "mysql+pymysql://aryan:password@localhost:3307/aidropout"

def seed_students():
    """Seed the database with student data from the CSV"""
    
    # Create engine and session
    engine = create_engine(LOCAL_DATABASE_URI, echo=False)
    db_session = scoped_session(sessionmaker(bind=engine))
    
    # Student data from students.csv
    students_data = [
        {
            "student_id": "STU001", "user_id": 12, "full_name": "ss",
            "attendance": 100, "avg_score": 75, "assignments_completed": 5, "behavior_score": 8,
            "grade": "B", "additional_info": "Consistent performance", "marital_status": "Single",
            "application_mode": "Regular", "course": "Computer Science", "cu1_enrolled": 1, "cu1_approved": 1,
            "cu1_grade": 15, "cu2_enrolled": 1, "cu2_approved": 1, "cu2_grade": 14, "gender": "male",
            "age_at_enrollment": 18, "scholarship_holder": "0", "debtor": "0", "tuition_fees_up_to_date": "1",
            "academic_score": 85, "risk_label": "Low"
        },
        {
            "student_id": "STU002", "user_id": 15, "full_name": "Tanishq Sharma",
            "attendance": 96.87, "avg_score": 82, "assignments_completed": 6, "behavior_score": 9,
            "grade": "A", "additional_info": "Excellent coder", "marital_status": "Single",
            "application_mode": "Regular", "course": "Computer Science", "cu1_enrolled": 1, "cu1_approved": 1,
            "cu1_grade": 16, "cu2_enrolled": 1, "cu2_approved": 1, "cu2_grade": 16.5, "gender": "Male",
            "age_at_enrollment": 19, "scholarship_holder": "0", "debtor": "0", "tuition_fees_up_to_date": "1",
            "academic_score": 90, "risk_label": "Low"
        },
        {
            "student_id": "STU003", "user_id": 16, "full_name": "Rajat",
            "attendance": 10, "avg_score": 40, "assignments_completed": 1, "behavior_score": 3,
            "grade": "D", "additional_info": "Good analytical skills", "marital_status": "Single",
            "application_mode": "Regular", "course": "Information Technology", "cu1_enrolled": 1, "cu1_approved": 0,
            "cu1_grade": 14.5, "cu2_enrolled": 1, "cu2_approved": 0, "cu2_grade": 15, "gender": "Male",
            "age_at_enrollment": 20, "scholarship_holder": "0", "debtor": "1", "tuition_fees_up_to_date": "0",
            "academic_score": 45, "risk_label": "High"
        },
        {
            "student_id": "STU004", "user_id": 17, "full_name": "dhirendra",
            "attendance": 5, "avg_score": 35, "assignments_completed": 0, "behavior_score": 2,
            "grade": "F", "additional_info": "Needs improvement", "marital_status": "Married",
            "application_mode": "Distance", "course": "Mechanical Engineering", "cu1_enrolled": 1, "cu1_approved": 0,
            "cu1_grade": 10, "cu2_enrolled": 1, "cu2_approved": 0, "cu2_grade": 9, "gender": "Male",
            "age_at_enrollment": 21, "scholarship_holder": "0", "debtor": "1", "tuition_fees_up_to_date": "0",
            "academic_score": 40, "risk_label": "Very High"
        },
        {
            "student_id": "STU005", "user_id": 18, "full_name": "raunak",
            "attendance": 63, "avg_score": 58, "assignments_completed": 3, "behavior_score": 5,
            "grade": "C", "additional_info": "Average performance", "marital_status": "Single",
            "application_mode": "Regular", "course": "Civil Engineering", "cu1_enrolled": 1, "cu1_approved": 1,
            "cu1_grade": 9, "cu2_enrolled": 1, "cu2_approved": 0, "cu2_grade": 8.5, "gender": "Male",
            "age_at_enrollment": 19, "scholarship_holder": "0", "debtor": "0", "tuition_fees_up_to_date": "1",
            "academic_score": 62, "risk_label": "Medium"
        },
        {
            "student_id": "STU006", "user_id": 19, "full_name": "ramlakhan",
            "attendance": 99.08, "avg_score": 74, "assignments_completed": 5, "behavior_score": 8,
            "grade": "B", "additional_info": "Hardworking", "marital_status": "Married",
            "application_mode": "Regular", "course": "Electronics", "cu1_enrolled": 1, "cu1_approved": 1,
            "cu1_grade": 14, "cu2_enrolled": 1, "cu2_approved": 1, "cu2_grade": 14.5, "gender": "Male",
            "age_at_enrollment": 22, "scholarship_holder": "0", "debtor": "0", "tuition_fees_up_to_date": "1",
            "academic_score": 82, "risk_label": "Low"
        },
        {
            "student_id": "STU007", "user_id": 20, "full_name": "ramlakhan",
            "attendance": 81.65, "avg_score": 78, "assignments_completed": 6, "behavior_score": 9,
            "grade": "A", "additional_info": "Excellent participation", "marital_status": "Single",
            "application_mode": "Regular", "course": "Computer Science", "cu1_enrolled": 1, "cu1_approved": 1,
            "cu1_grade": 15.5, "cu2_enrolled": 1, "cu2_approved": 1, "cu2_grade": 16, "gender": "Male",
            "age_at_enrollment": 20, "scholarship_holder": "0", "debtor": "0", "tuition_fees_up_to_date": "1",
            "academic_score": 88, "risk_label": "Low"
        },
        {
            "student_id": "STU008", "user_id": 21, "full_name": "Gaurav tulsyani",
            "attendance": 90.99, "avg_score": 85, "assignments_completed": 7, "behavior_score": 10,
            "grade": "A", "additional_info": "Top performer", "marital_status": "Single",
            "application_mode": "Regular", "course": "Computer Science", "cu1_enrolled": 1, "cu1_approved": 1,
            "cu1_grade": 17.5, "cu2_enrolled": 1, "cu2_approved": 1, "cu2_grade": 18, "gender": "Male",
            "age_at_enrollment": 18, "scholarship_holder": "0", "debtor": "0", "tuition_fees_up_to_date": "1",
            "academic_score": 95, "risk_label": "Minimal"
        },
        {
            "student_id": "STU009", "user_id": 22, "full_name": "darshanpal singh",
            "attendance": 55, "avg_score": 60, "assignments_completed": 3, "behavior_score": 6,
            "grade": "C", "additional_info": "Good in teamwork", "marital_status": "Married",
            "application_mode": "Regular", "course": "Information Technology", "cu1_enrolled": 1, "cu1_approved": 1,
            "cu1_grade": 14, "cu2_enrolled": 1, "cu2_approved": 0, "cu2_grade": 14.5, "gender": "Male",
            "age_at_enrollment": 23, "scholarship_holder": "0", "debtor": "0", "tuition_fees_up_to_date": "1",
            "academic_score": 65, "risk_label": "Medium"
        },
        {
            "student_id": "STU010", "user_id": 23, "full_name": "Saumya yadav",
            "attendance": 97.19, "avg_score": 88, "assignments_completed": 8, "behavior_score": 9,
            "grade": "A", "additional_info": "Excellent communication", "marital_status": "Single",
            "application_mode": "Regular", "course": "Computer Science", "cu1_enrolled": 1, "cu1_approved": 1,
            "cu1_grade": 18, "cu2_enrolled": 1, "cu2_approved": 1, "cu2_grade": 18.5, "gender": "Female",
            "age_at_enrollment": 19, "scholarship_holder": "0", "debtor": "0", "tuition_fees_up_to_date": "1",
            "academic_score": 92, "risk_label": "Low"
        },
        {
            "student_id": "STU011", "user_id": 24, "full_name": "Anjali Sharma",
            "attendance": 95.82, "avg_score": 90, "assignments_completed": 9, "behavior_score": 10,
            "grade": "A+", "additional_info": "Outstanding performance", "marital_status": "Single",
            "application_mode": "Regular", "course": "Computer Science", "cu1_enrolled": 1, "cu1_approved": 1,
            "cu1_grade": 19.5, "cu2_enrolled": 1, "cu2_approved": 1, "cu2_grade": 20, "gender": "Female",
            "age_at_enrollment": 18, "scholarship_holder": "0", "debtor": "0", "tuition_fees_up_to_date": "1",
            "academic_score": 97, "risk_label": "Minimal"
        },
        {
            "student_id": "STU012", "user_id": 25, "full_name": "Gaurav Saini",
            "attendance": 12, "avg_score": 38, "assignments_completed": 1, "behavior_score": 3,
            "grade": "D", "additional_info": "Can improve", "marital_status": "Single",
            "application_mode": "Distance", "course": "Mechanical Engineering", "cu1_enrolled": 1, "cu1_approved": 0,
            "cu1_grade": 9.5, "cu2_enrolled": 1, "cu2_approved": 0, "cu2_grade": 9, "gender": "Male",
            "age_at_enrollment": 21, "scholarship_holder": "0", "debtor": "1", "tuition_fees_up_to_date": "0",
            "academic_score": 50, "risk_label": "High"
        },
        {
            "student_id": "STU013", "user_id": 26, "full_name": "musraf khan",
            "attendance": 69, "avg_score": 62, "assignments_completed": 4, "behavior_score": 6,
            "grade": "B", "additional_info": "Good dedication", "marital_status": "Married",
            "application_mode": "Regular", "course": "Civil Engineering", "cu1_enrolled": 1, "cu1_approved": 1,
            "cu1_grade": 15, "cu2_enrolled": 1, "cu2_approved": 1, "cu2_grade": 15.5, "gender": "Male",
            "age_at_enrollment": 20, "scholarship_holder": "0", "debtor": "0", "tuition_fees_up_to_date": "1",
            "academic_score": 70, "risk_label": "Medium"
        },
        {
            "student_id": "STU014", "user_id": 27, "full_name": "Arvind singh Rathore",
            "attendance": 89.13, "avg_score": 73, "assignments_completed": 5, "behavior_score": 7,
            "grade": "B", "additional_info": "Improving steadily", "marital_status": "Married",
            "application_mode": "Regular", "course": "Electronics", "cu1_enrolled": 1, "cu1_approved": 1,
            "cu1_grade": 14.2, "cu2_enrolled": 1, "cu2_approved": 1, "cu2_grade": 14.5, "gender": "Male",
            "age_at_enrollment": 22, "scholarship_holder": "0", "debtor": "0", "tuition_fees_up_to_date": "1",
            "academic_score": 81, "risk_label": "Low"
        },
        {
            "student_id": "STU015", "user_id": 28, "full_name": "Ankur Choudhary",
            "attendance": 94.54, "avg_score": 79, "assignments_completed": 6, "behavior_score": 8,
            "grade": "A", "additional_info": "Strong fundamentals", "marital_status": "Single",
            "application_mode": "Regular", "course": "Information Technology", "cu1_enrolled": 1, "cu1_approved": 1,
            "cu1_grade": 16, "cu2_enrolled": 1, "cu2_approved": 1, "cu2_grade": 16.5, "gender": "Male",
            "age_at_enrollment": 20, "scholarship_holder": "0", "debtor": "0", "tuition_fees_up_to_date": "1",
            "academic_score": 89, "risk_label": "Low"
        },
        {
            "student_id": "STU016", "user_id": 29, "full_name": "Arpit Khichar",
            "attendance": 85.3, "avg_score": 83, "assignments_completed": 7, "behavior_score": 9,
            "grade": "A", "additional_info": "Great leadership", "marital_status": "Single",
            "application_mode": "Regular", "course": "Computer Science", "cu1_enrolled": 1, "cu1_approved": 1,
            "cu1_grade": 17, "cu2_enrolled": 1, "cu2_approved": 1, "cu2_grade": 17.5, "gender": "Male",
            "age_at_enrollment": 19, "scholarship_holder": "0", "debtor": "0", "tuition_fees_up_to_date": "1",
            "academic_score": 93, "risk_label": "Minimal"
        },
        {
            "student_id": "STU017", "user_id": 30, "full_name": "John Doe",
            "attendance": 20, "avg_score": 25, "assignments_completed": 0, "behavior_score": 1,
            "grade": "F", "additional_info": "Poor performance", "marital_status": "Married",
            "application_mode": "Distance", "course": "Mechanical Engineering", "cu1_enrolled": 1, "cu1_approved": 0,
            "cu1_grade": 8, "cu2_enrolled": 1, "cu2_approved": 0, "cu2_grade": 7, "gender": "Male",
            "age_at_enrollment": 25, "scholarship_holder": "0", "debtor": "1", "tuition_fees_up_to_date": "0",
            "academic_score": 30, "risk_label": "Very High"
        },
        {
            "student_id": "STU018", "user_id": 31, "full_name": "Jane Smith",
            "attendance": 15, "avg_score": 20, "assignments_completed": 0, "behavior_score": 2,
            "grade": "F", "additional_info": "Struggling", "marital_status": "Single",
            "application_mode": "Regular", "course": "Civil Engineering", "cu1_enrolled": 1, "cu1_approved": 0,
            "cu1_grade": 6, "cu2_enrolled": 1, "cu2_approved": 0, "cu2_grade": 5, "gender": "Female",
            "age_at_enrollment": 24, "scholarship_holder": "0", "debtor": "1", "tuition_fees_up_to_date": "0",
            "academic_score": 25, "risk_label": "Very High"
        },
        {
            "student_id": "STU019", "user_id": 32, "full_name": "Bob Johnson",
            "attendance": 10, "avg_score": 15, "assignments_completed": 0, "behavior_score": 1,
            "grade": "F", "additional_info": "Needs help", "marital_status": "Married",
            "application_mode": "Distance", "course": "Electronics", "cu1_enrolled": 1, "cu1_approved": 0,
            "cu1_grade": 5, "cu2_enrolled": 1, "cu2_approved": 0, "cu2_grade": 4, "gender": "Male",
            "age_at_enrollment": 26, "scholarship_holder": "0", "debtor": "1", "tuition_fees_up_to_date": "0",
            "academic_score": 20, "risk_label": "Very High"
        },
        {
            "student_id": "STU020", "user_id": 33, "full_name": "Alice Brown",
            "attendance": 5, "avg_score": 10, "assignments_completed": 0, "behavior_score": 1,
            "grade": "F", "additional_info": "Very low", "marital_status": "Single",
            "application_mode": "Regular", "course": "Information Technology", "cu1_enrolled": 1, "cu1_approved": 0,
            "cu1_grade": 4, "cu2_enrolled": 1, "cu2_approved": 0, "cu2_grade": 3, "gender": "Female",
            "age_at_enrollment": 27, "scholarship_holder": "0", "debtor": "1", "tuition_fees_up_to_date": "0",
            "academic_score": 15, "risk_label": "Very High"
        },
        {
            "student_id": "STU021", "user_id": 34, "full_name": "Charlie Wilson",
            "attendance": 30, "avg_score": 30, "assignments_completed": 1, "behavior_score": 2,
            "grade": "F", "additional_info": "Below average", "marital_status": "Married",
            "application_mode": "Distance", "course": "Computer Science", "cu1_enrolled": 1, "cu1_approved": 0,
            "cu1_grade": 9, "cu2_enrolled": 1, "cu2_approved": 0, "cu2_grade": 8, "gender": "Male",
            "age_at_enrollment": 28, "scholarship_holder": "0", "debtor": "1", "tuition_fees_up_to_date": "0",
            "academic_score": 35, "risk_label": "High"
        },
        {
            "student_id": "STU022", "user_id": 35, "full_name": "Eve Davis",
            "attendance": 25, "avg_score": 22, "assignments_completed": 0, "behavior_score": 2,
            "grade": "F", "additional_info": "Not performing", "marital_status": "Single",
            "application_mode": "Regular", "course": "Mechanical Engineering", "cu1_enrolled": 1, "cu1_approved": 0,
            "cu1_grade": 7, "cu2_enrolled": 1, "cu2_approved": 0, "cu2_grade": 6, "gender": "Female",
            "age_at_enrollment": 29, "scholarship_holder": "0", "debtor": "1", "tuition_fees_up_to_date": "0",
            "academic_score": 28, "risk_label": "Very High"
        },
        {
            "student_id": "STU023", "user_id": 36, "full_name": "Frank Miller",
            "attendance": 18, "avg_score": 18, "assignments_completed": 0, "behavior_score": 1,
            "grade": "F", "additional_info": "Needs intervention", "marital_status": "Married",
            "application_mode": "Distance", "course": "Civil Engineering", "cu1_enrolled": 1, "cu1_approved": 0,
            "cu1_grade": 6, "cu2_enrolled": 1, "cu2_approved": 0, "cu2_grade": 5, "gender": "Male",
            "age_at_enrollment": 30, "scholarship_holder": "0", "debtor": "1", "tuition_fees_up_to_date": "0",
            "academic_score": 22, "risk_label": "Very High"
        },
        {
            "student_id": "STU024", "user_id": 37, "full_name": "Grace Lee",
            "attendance": 12, "avg_score": 12, "assignments_completed": 0, "behavior_score": 1,
            "grade": "F", "additional_info": "Struggling badly", "marital_status": "Single",
            "application_mode": "Regular", "course": "Electronics", "cu1_enrolled": 1, "cu1_approved": 0,
            "cu1_grade": 5, "cu2_enrolled": 1, "cu2_approved": 0, "cu2_grade": 4, "gender": "Female",
            "age_at_enrollment": 31, "scholarship_holder": "0", "debtor": "1", "tuition_fees_up_to_date": "0",
            "academic_score": 18, "risk_label": "Very High"
        },
        {
            "student_id": "STU025", "user_id": 38, "full_name": "Henry Taylor",
            "attendance": 8, "avg_score": 8, "assignments_completed": 0, "behavior_score": 1,
            "grade": "F", "additional_info": "Very poor", "marital_status": "Married",
            "application_mode": "Distance", "course": "Information Technology", "cu1_enrolled": 1, "cu1_approved": 0,
            "cu1_grade": 4, "cu2_enrolled": 1, "cu2_approved": 0, "cu2_grade": 3, "gender": "Male",
            "age_at_enrollment": 32, "scholarship_holder": "0", "debtor": "1", "tuition_fees_up_to_date": "0",
            "academic_score": 12, "risk_label": "Very High"
        },
    ]

    session = db_session()
    
    try:
        # Create users first (if they don't exist)
        created_users = []
        for data in students_data:
            user_id = data['user_id']
            result = session.execute(text("SELECT id FROM users WHERE id = :id"), {"id": user_id})
            existing_user = result.fetchone()
            if not existing_user:
                password_hash = generate_password_hash("password123")
                session.execute(text("""
                    INSERT INTO users (id, username, email, password_hash, role, verified, created_at)
                    VALUES (:id, :username, :email, :password_hash, :role, :verified, NOW())
                """), {
                    "id": user_id,
                    "username": data['student_id'].lower(),
                    "email": f"{data['student_id'].lower()}@example.com",
                    "password_hash": password_hash,
                    "role": "student",
                    "verified": True
                })
                created_users.append(user_id)
                print(f"Created user: {data['student_id'].lower()}")
        
        session.commit()
        print(f"\nCreated {len(created_users)} new users")

        # Create students (if they don't exist)
        created_students = []
        for data in students_data:
            result = session.execute(text("SELECT id FROM students WHERE student_id = :student_id"), {"student_id": data['student_id']})
            existing_student = result.fetchone()
            if not existing_student:
                session.execute(text("""
                    INSERT INTO students (
                        student_id, user_id, full_name, assignments_completed, behavior_score,
                        course, gender, marital_status, application_mode, age_at_enrollment,
                        scholarship_holder, debtor, tuition_fees_up_to_date,
                        cu1_enrolled, cu1_approved, cu1_grade,
                        cu2_enrolled, cu2_approved, cu2_grade,
                        attendance, avg_score, grade, additional_info, academic_score
                    ) VALUES (
                        :student_id, :user_id, :full_name, :assignments_completed, :behavior_score,
                        :course, :gender, :marital_status, :application_mode, :age_at_enrollment,
                        :scholarship_holder, :debtor, :tuition_fees_up_to_date,
                        :cu1_enrolled, :cu1_approved, :cu1_grade,
                        :cu2_enrolled, :cu2_approved, :cu2_grade,
                        :attendance, :avg_score, :grade, :additional_info, :academic_score
                    )
                """), {
                    "student_id": data['student_id'],
                    "user_id": data['user_id'],
                    "full_name": data['full_name'],
                    "assignments_completed": data['assignments_completed'],
                    "behavior_score": data['behavior_score'],
                    "course": data['course'],
                    "gender": data['gender'],
                    "marital_status": data['marital_status'],
                    "application_mode": data['application_mode'],
                    "age_at_enrollment": data['age_at_enrollment'],
                    "scholarship_holder": data['scholarship_holder'],
                    "debtor": data['debtor'],
                    "tuition_fees_up_to_date": data['tuition_fees_up_to_date'],
                    "cu1_enrolled": data['cu1_enrolled'],
                    "cu1_approved": data['cu1_approved'],
                    "cu1_grade": data['cu1_grade'],
                    "cu2_enrolled": data['cu2_enrolled'],
                    "cu2_approved": data['cu2_approved'],
                    "cu2_grade": data['cu2_grade'],
                    "attendance": data['attendance'],
                    "avg_score": data['avg_score'],
                    "grade": data['grade'],
                    "additional_info": data['additional_info'],
                    "academic_score": data['academic_score']
                })
                created_students.append(data['student_id'])
                print(f"Created student: {data['full_name']} ({data['student_id']})")
        
        session.commit()
        print(f"\nCreated {len(created_students)} new students")
        print("\nSeeding completed!")
        
    except Exception as e:
        session.rollback()
        print(f"Error: {e}")
        raise
    finally:
        db_session.remove()
        engine.dispose()

if __name__ == "__main__":
    seed_students()

