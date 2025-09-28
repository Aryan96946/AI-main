# AI Dropout Prediction & Counseling System

## Quick start (local, Docker)
1. Copy `.env.example` to `.env` and set secrets.
2. (Optional) Prepare training data: `backend/data/train.csv` and run `python backend/train_model.py` to produce `backend/model/latest_model.joblib`.
3. Start: `docker-compose up --build`
4. Backend API: http://localhost:5000/api/
5. Frontend UI: http://localhost:8080/

## Notes
- Run migrations with Flask-Migrate if needed.
- Keep secrets safe; use a real secrets manager for production.
