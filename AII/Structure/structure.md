AI-11/
├── backend/                
│   ├── app.py
│   ├── auth.py
│   ├── config.py
│   ├── create_db.py
│   ├── Dockerfile
│   ├── email_utils.py
│   ├── entrypoint.sh
│   ├── ml/                
│   │   ├── explain.py
|   |   ├── importer.py
│   │   ├── model.pkl
│   │   ├── preprocess.py
│   │   ├── recommend.py
│   │   ├── students.csv
│   │   └── train_model.py
│   ├── models.py
│   ├── migrations
│   ├── requirements.txt
│   ├── routes/ 
|   |   ├──__init__.py          
│   │   ├── admin.py
│   │   ├── auth_routes.py
│   │   ├── predict.py
│   │   ├── students.py
│   │   ├── teachers.py
|   |   ├── ml_routes.py
|   |   ├── upload_csv.py
|   |   └── counseling.py
│   └── update_passwords.py
├── docker-compose.yml      
├── frontend/               
│   ├── Dockerfile
│   ├── package.json
│   ├── package-lock.json
│   ├── public/
│   │   └── index.html
│   └── src/
│       ├── api/
│       │   └── auth.js
│       ├── api.js
│       ├── App.js
│       ├── components/
│       │   ├── auth/
│       │   │   ├── Login.jsx
│       │   │   └── Register.jsx
│       │   ├── dashboards/
│       │   │   ├── AdminDashboard.jsx
│       │   │   ├── StudentDashboard.jsx
│       │   │   └── TeacherDashboard.jsx
|       |   ├── Home.jsx
│       │   ├── PredictionForm.jsx
│       │   └── shared/
│       │       └── ProtectedRoute.jsx
│       └── index.js
├── .env
├── package.json
└── README.md
