AI/
├── README.md
├── TODO.md
├── docker-compose.yml
├── ngrok-deploy.sh
├── ngrok.yml
├── package.json
├── NGROK_DEPLOYMENT.md
├── backend/
│   ├── app.py
│   ├── auth.py
│   ├── config.py
│   ├── create_db.py
│   ├── Dockerfile
│   ├── email_utils.py
│   ├── entrypoint.sh
│   ├── models.py
│   ├── requirements.txt
│   ├── seed_users.py
│   ├── update_passwords.py
│   ├── migrations/
│   │   ├── alembic.ini
│   │   ├── env.py
│   │   ├── versions/
│   │   │   ├── 22c6b2419cf5_add_department_and_class_name_fields.py
│   │   │   ├── 9876a5762856_rename_acodemic_score_to_academic_score.py
│   │   │   └── add_student_id.py
│   └── routes/
│       ├── __init__.py
│       ├── admin.py
│       ├── auth_routes.py
│       ├── counseling.py
│       ├── ml_routes.py
│       ├── predict.py
│       ├── students.py
│       ├── teachers.py
│       └── upload_csv.py
│   └── ml/
│       ├── explain.py
│       ├── importer.py
│       ├── model.pkl
│       ├── preprocess.pkl
│       ├── preprocess.py
│       ├── recommend.py
│       ├── students.csv
│       ├── train_model.py
│       └── train_preprocessor.py
├── frontend/
│   ├── Dockerfile
│   ├── package.json
│   ├── package-lock.json
│   ├── public/
│   │   └── index.html
│   └── src/
│       ├── api.js
│       ├── api/auth.js
│       ├── App.js
│       ├── index.js
│       └── components/
│           ├── Home.jsx
│           ├── PredictionForm.jsx
│           ├── auth/
│           │   ├── Login.jsx
│           │   ├── Register.jsx
│           │   ├── ForgotPassword.jsx
│           │   └── ResetPassword.jsx
│           ├── dashboards/
│           │   ├── AdminDashboard.jsx
│           │   ├── StudentDashboard.jsx
│           │   └── TeacherDashboard.jsx
│           └── shared/
│               └── ProtectedRoute.jsx
│   └── build/
└── Logs & Misc/
    ├── ngrok*.log
    ├── ngrok-v3.zip