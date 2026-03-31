# 🎓 AI Dropout Prediction & Counseling System

[![Docker](https://img.shields.io/badge/Docker-Deploy-blue)](https://hub.docker.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-18-blue.svg)](https://reactjs.org/)
[![Flask](https://img.shields.io/badge/Flask-2.2.5-green.svg)](https://flask.palletsprojects.com/)

A **full-stack AI-powered web application** for **predicting and preventing student dropouts** in educational institutions. Uses machine learning to analyze academic and behavioral data, providing personalized risk assessments and counseling recommendations for Students, Teachers, and Admins.

## ✨ Live Demo
- **Public URLs**: Generated via ngrok (run `./ngrok-deploy.sh` for instant public access)
- **Frontend**: `http://localhost:3000` (local) or ngrok URL
- **Backend API**: `http://localhost:5000/api/health`

## 🚀 Features (5 Phases)

### Phase 1: Core Foundation
- Flask REST API + React frontend
- MySQL database with Alembic migrations
- JWT-based role authentication (Student/Teacher/Admin)
- Docker Compose for easy deployment

### Phase 2: Student Dashboard
- Personal dropout risk prediction
- Academic performance charts (Recharts)
- Risk factors breakdown & recommendations

### Phase 3: Teacher Dashboard
- Monitor assigned students/batches
- Risk analytics & counseling session notes
- Bulk student insights

### Phase 4: Admin Dashboard
- User/role management
- School-wide analytics & reports
- CSV data import/export

### Phase 5: AI/ML Integration
- **XGBoost model** (`backend/ml/model.pkl`) predicts dropout risk
- **Input Features**: `attendance`, `avg_score`, `assignments_completed`, `behavior_score`
- Real-time predictions via `/api/predict`
- Model explanations (SHAP), retraining (`train_model.py`)
- Counseling recommendations based on risk levels

## 🛠️ Tech Stack

| Category      | Technologies |
|---------------|--------------|
| **Frontend**  | React 18, React Router, Axios, Recharts, Framer Motion, Lucide Icons |
| **Backend**   | Flask 2.2.5, SQLAlchemy, Flask-JWT-Extended, Flask-Mail, Alembic |
| **Database**  | MySQL 8.0 |
| **ML**        | Scikit-learn 1.7.2, XGBoost 2.0, Pandas, NumPy, Joblib, SHAP |
| **DevOps**    | Docker, Docker Compose, ngrok |
| **Other**     | PyMySQL, python-dotenv, CORS |

## 📋 Quick Start (Docker + ngrok)

1. **Clone & Setup**:
   ```bash
   git clone <repo-url>
   cd AI-dropout-project
   ```

2. **Environment** (create `backend/.env`):
   ```
   EMAIL_USER=your_gmail@gmail.com
   EMAIL_PASSWORD=your_app_password
   JWT_SECRET_KEY=your_jwt_secret
   SECRET_KEY=your_flask_secret
   DATABASE_URI=mysql+pymysql://root:password@db:3306/aidropout
   ```

3. **Deploy** (one command!):
   ```bash
   chmod +x ngrok-deploy.sh
   ./ngrok-deploy.sh
   ```

4. **Access**: Use printed ngrok URLs

## 🗄️ Database & ML Setup

**Backend container**:
```bash
python create_db.py
python seed_users.py
python ml/train_model.py  # Uses backend/ml/students_full.csv (240 rows)
```

## 🌐 API Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/login` | JWT login (OTP) | - |
| POST | `/api/predict` | ML prediction | ✓ |
| POST | `/api/upload_csv` | Import students CSV | ✓ (teacher/admin) |
| GET | `/api/students` | List students | ✓ |

## 📁 Sample Data Files

- `backend/ml/student_upload.csv` - 240 rows for teacher upload (`/api/upload_csv`)
- `backend/ml/students_full.csv` - Training data w/ Target label
- Headers match Student model & importer.py

See [`Structure/structure.md`](./Structure/structure.md)

## 🖼️ Screenshots

- **Student Dashboard**: ![Student Dashboard](screenshots/student-dashboard.png)
- **Prediction Form**: ![Prediction](screenshots/prediction.png)
- **Teacher Dashboard**: ![Teacher Dashboard](screenshots/teacher-dashboard.png)

## 🔧 Local Development

**Backend**:
```bash
cd backend && pip install -r requirements.txt && python create_db.py && flask run
```

**Frontend**:
```bash
cd frontend && npm start
```

## 🚀 Deployment

- **Dev**: `./ngrok-deploy.sh`
- **Prod**: Docker to cloud

## 🔍 Troubleshooting

| Issue | Solution |
|-------|----------|
| DB Connection | `docker-compose logs db` |
| CSV Upload | Check headers match Student model |
| ML Train | Ensure scikit-learn==1.7.2 |


