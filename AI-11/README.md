# 🎓 AI Dropout Prediction & Counseling System

A full-stack web application to **predict and prevent student dropouts** using AI.
Built with **React**, **Flask**, and **MySQL**, it supports multiple roles — Student, Teacher, and Admin.

---

## 🧠 Features (Phases 1–4)

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

---

## ⚙️ Tech Stack

**Frontend:** React, HTML, CSS, JS  
**Backend:** Flask, SQLAlchemy, JWT  
**Database:** MySQL  
**Containerization:** Docker  
**Visualization:** Recharts / Chart.js  

---




##  Procedure

Sure! Here's the complete **README.md** in one block that you can directly copy:

markdown
# AI Dropout Project - AI-11

This project is a student monitoring and counseling system, supporting admin, teacher, and student roles. It includes a backend built with Flask and a frontend built with React.



## Project Structure



AI-11/
├── backend/                 # Flask backend
│   ├── app.py
│   ├── auth.py
│   ├── config.py
│   ├── create_db.py
│   ├── models.py
│   ├── routes/              # API routes
│   │   ├── admin.py
│   │   ├── auth_routes.py
│   │   ├── students.py
│   │   └── teachers.py
│   ├── email_utils.py
│   └── requirements.txt
├── frontend/                # React frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/Login.js
│   │   │   ├── auth/Register.js
│   │   │   └── dashboards/
│   │   │       ├── AdminDashboard.js
│   │   │       ├── StudentDashboard.js
│   │   │       └── TeacherDashboard.js
│   │   ├── api.js
│   │   └── index.js
│   ├── public/index.html
│   └── package.json
├── docker-compose.yml       # Docker Compose configuration
└── structure/STRUCTURE.md





## Prerequisites

- Docker & Docker Compose installed
- Git (to clone the repository)
- Internet connection (for installing dependencies and sending OTP emails)

---

## Step 1: Clone the Repository

# bash
git clone <repository-url>
cd AI-dropout-project/AI-11




## Step 2: Setup Environment Variables (Optional)

Create a `.env` file in the `backend/` folder to configure sensitive information like email credentials:

#  env
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASSWORD=your_app_password
JWT_SECRET_KEY=your_secret_key


> Note: Gmail may require an **App Password** if 2FA is enabled.

---

## Step 3: Build and Start Docker Containers

Use Docker Compose to build and run both backend and frontend:

# bash
docker-compose up --build


This will create three containers:

* **backend** → Flask API server
* **db** → MySQL database
* **frontend** → React app

> Access the React frontend at: [http://localhost:3000](http://localhost:3000)
> Flask backend API runs at: [http://localhost:5000](http://localhost:5000)

---

## Step 4: Initialize the Database

Open a terminal in the backend container:

#  bash
docker exec -it <backend_container_name> bash
python create_db.py


This will:

* Create all tables (`users`, `students`, `counseling_sessions`, `predictions`, etc.)
* Add default admin/teacher/student accounts (if configured)

---

## Step 5: Run the Application (Optional for Development)

If you want to run backend or frontend manually:

### Backend:

#  bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
export FLASK_APP=app.py
flask run --host=0.0.0.0


### Frontend:

#  bash
cd frontend
npm install
npm start


---

## Step 6: Login Credentials

* **Admin**

  * Email: `aryannawal1006@gmail.com`
  * Password: `changeme123`
* **Teacher**

  * Email: `maheshwari96946@gmail.com`
  * Password: `changeme123`
* **Student**

  * Email: `aryannawal185@gmail.com`
  * Password: `changeme123`

> Note: All accounts require OTP verification after registration/login for first-time access.



## Step 7: Access the Dashboards

* **Student Dashboard** → `/student`
* **Teacher Dashboard** → `/teacher`
* **Admin Dashboard** → `/admin`



## Step 8: API Endpoints

### Auth Routes

| Method | Endpoint                   | Description              |
| ------ | -------------------------- | ------------------------ |
| POST   | `/api/auth/register`       | Register new user        |
| POST   | `/api/auth/login`          | Login via OTP            |
| POST   | `/api/auth/verify-otp`     | Verify OTP and get token |
| POST   | `/api/auth/login-password` | Login with password      |

### Student Routes

| Method | Endpoint              | Description             |
| ------ | --------------------- | ----------------------- |
| GET    | `/api/student/me`     | Get student profile     |
| PUT    | `/api/student/<id>`   | Update student details  |
| POST   | `/api/student/import` | Import students via CSV |

### Teacher Routes

| Method | Endpoint                     | Description                |
| ------ | ---------------------------- | -------------------------- |
| GET    | `/api/teacher/students`      | List all students          |
| POST   | `/api/teacher/<id>/counsel`  | Add counseling session     |
| POST   | `/api/teacher/batch_predict` | Create predictions for all |

---

## Step 9: Stopping the Containers

#  bash
docker-compose down


This will stop and remove all containers.

---

## Notes

* Ensure MySQL container is running before backend starts.
* Check backend logs for OTP sending issues or database errors:

#  bash
docker logs -f <backend_container_name>


* Use **Postman** or **Frontend UI** to test APIs and dashboards.

---

## License

This project is for educational purposes only.

```

You can copy this entire block into a `README.md` file.  

If you want, I can also **add a super quick “one-command start” section** for developers who don’t want to run backend/frontend separately. Do you want me to do that?
```

cd ai-dropout-system

