# 🎓 AI Dropout Prediction & Counseling System

A full-stack web application to **predict and prevent student dropouts** using AI.
Built with **React**, **Flask**, and **MySQL**, it supports multiple roles — Student, Teacher, and Admin.

---

## 🧠 Features (Phases 1–5)

### Phase 1 – Core System Foundation
- Flask REST API + MySQL
- Role-based authentication (JWT)
- React frontend layout & routing
- Docker setup for full stack

### Phase 2 – Student Interface
- Dashboard with personal dropout risk
- Academic performance charts
- Risk factor insights

### Phase 3 – Teacher Interface
- Student monitoring & counseling dashboard
- Batch risk analysis
- Counseling notes management

### Phase 4 – Admin Interface
- User & role management
- School-wide reports and analytics
- Data import/export support

### Phase 5 – AI Integration & Predictive Analytics
- ML model for predicting student dropout risk
- Input features: attendance, average score, assignments completed, behavior score
- `/api/predict` endpoint for real-time risk prediction
- Recommendation engine based on risk level
- Teachers can add counseling sessions based on predictions
- Admins can retrain ML model with new student data
- Visualization: model accuracy, ROC curves, feature importance

---

## ⚙️ Tech Stack

**Frontend:** React, HTML, CSS, JS  
**Backend:** Flask, SQLAlchemy, JWT  
**Database:** MySQL  
**Containerization:** Docker  
**Machine Learning:** Scikit-learn, Pandas, NumPy  
**Visualization:** Recharts / Chart.js  

---

## Project Structure

AI-11
├── backend
│   ├── app.py
│   ├── auth.py
│   ├── config.py
│   ├── create_db.py
│   ├── Dockerfile
│   ├── email_utils.py
│   ├── entrypoint.sh
│   ├── ml
│   │   ├── explain.py
│   │   ├── model.pkl
│   │   ├── preprocess.py
│   │   ├── __pycache__
│   │   │   └── recommend.cpython-311.pyc
│   │   ├── recommend.py
│   │   ├── student_data.csv
│   │   └── train_model.py
│   ├── models.py
│   ├── __pycache__
│   │   ├── app.cpython-311.pyc
│   │   ├── app.cpython-313.pyc
│   │   ├── auth.cpython-311.pyc
│   │   ├── config.cpython-311.pyc
│   │   ├── email_utils.cpython-311.pyc
│   │   └── models.cpython-311.pyc
│   ├── requirements.txt
│   ├── routes
│   │   ├── admin.py
│   │   ├── auth_routes.py
│   │   ├── __init__.py
│   │   ├── predict.py
│   │   ├── __pycache__
│   │   │   ├── admin.cpython-311.pyc
│   │   │   ├── admin.cpython-313.pyc
│   │   │   ├── auth_routes.cpython-311.pyc
│   │   │   ├── auth_routes.cpython-313.pyc
│   │   │   ├── __init__.cpython-311.pyc
│   │   │   ├── __init__.cpython-313.pyc
│   │   │   ├── predict.cpython-311.pyc
│   │   │   ├── students.cpython-311.pyc
│   │   │   ├── students.cpython-313.pyc
│   │   │   ├── teachers.cpython-311.pyc
│   │   │   └── teachers.cpython-313.pyc
│   │   ├── students.py
│   │   └── teachers.py
│   └── update_passwords.py
├── docker-compose.yml
├── frontend
│   ├── Dockerfile
│   ├── package.json
│   ├── package-lock.json
│   ├── public
│   │   └── index.html
│   └── src
│       ├── api
│       │   └── auth.js
│       ├── api.js
│       ├── App.js
│       ├── components
│       │   ├── auth
│       │   │   ├── Login.js
│       │   │   └── Register.js
│       │   ├── dashboards
│       │   │   ├── AdminDashboard.js
│       │   │   ├── StudentDashboard.js
│       │   │   └── TeacherDashboard.js
│       │   ├── PredictionForm.jsx
│       │   └── shared
│       │       ├── ProtectedRoute.js
│       │       └── Sidebar.js
│       └── index.js
├── package.json
└── README.md



---

## Prerequisites

- Docker & Docker Compose installed
- Git
- Internet connection (for installing dependencies and sending OTP emails)

---

Here’s the **entire procedure section formatted in one markdown code block** ready to copy into `README.md`:

````markdown
## 📌 Procedure

### Step 1: Clone the Repository


git clone <repository-url>
cd AI-dropout-project/AI-11


### Step 2: Setup Environment Variables

Create a `.env` file in `backend/`:


EMAIL_USER=your_gmail@gmail.com
EMAIL_PASSWORD=your_app_password
JWT_SECRET_KEY=your_secret_key
SECRET_KEY=your_secret_key


### Step 3: Build and Start Docker Containers

docker-compose up --build

* **backend** → Flask API server
* **db** → MySQL database
* **frontend** → React app

Access the apps:

* Frontend: [http://localhost:3000](http://localhost:3000)
* Backend API: [http://localhost:5000](http://localhost:5000)

### Step 4: Initialize the Database

docker exec -it <backend_container_name> bash
python create_db.py

### Step 5: Train the ML Model (Phase 5)

Inside the backend container:

python ml/train_model.py

> Ensure `ml/student_data.csv` exists with features: `attendance`, `avg_score`, `assignments_completed`, `behavior_score`, `dropout`.

### Step 6: Run the Application (Optional for Development)

#### Backend:

cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
export FLASK_APP=app.py
flask run --host=0.0.0.0

#### Frontend:

cd frontend
npm install
npm start

