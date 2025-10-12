AI Dropout Prediction & Counseling System
=========================================
A demo full-stack app that predicts dropout risk and supports counseling workflows.

Quick start (with docker-compose - uses local MySQL service):
1. Copy `.env.example` to `.env` and fill values.
2. Build/train model locally:
   - cd backend
   - python train_model.py
   - This saves model at backend/model/dropout_model.joblib
3. Start:
   - docker-compose up --build
4. Frontend at http://localhost:8080 and backend API at http://localhost:5000/api

Notes:
- To use an external MySQL (e.g., Kali Linux host), point DATABASE_URL in .env to that host.
- Create DB and grant user privileges:
  CREATE DATABASE ai_dropout;
  CREATE USER 'ai_user'@'%' IDENTIFIED BY 'ai_pass';
  GRANT ALL PRIVILEGES ON ai_dropout.* TO 'ai_user'@'%';
  FLUSH PRIVILEGES;
- Run migrations:
  docker exec -it ai_dropout_backend flask db upgrade

Security:
- Replace default secrets in production.
