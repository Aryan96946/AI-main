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
│   │   ├── model.pkl
│   │   ├── preprocess.py
│   │   ├── recommend.py
│   │   ├── student_data.csv
│   │   └── train_model.py
│   ├── models.py
│   ├── requirements.txt
│   ├── routes/           
│   │   ├── admin.py
│   │   ├── auth_routes.py
│   │   ├── predict.py
│   │   ├── students.py
│   │   └── teachers.py
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
│       │   │   ├── Login.js
│       │   │   └── Register.js
│       │   ├── dashboards/
│       │   │   ├── AdminDashboard.js
│       │   │   ├── StudentDashboard.js
│       │   │   └── TeacherDashboard.js
│       │   ├── PredictionForm.jsx
│       │   └── shared/
│       │       ├── ProtectedRoute.js
│       │       └── Sidebar.js
│       └── index.js
├── package.json
└── README.md
