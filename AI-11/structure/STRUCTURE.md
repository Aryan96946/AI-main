ai-dropout/
├─ backend/
│  ├─ app.py
│  ├─ config.py
│  ├─ requirements.txt
│  ├─ models.py
│  ├─ auth.py
│  ├─ routes/
│  │  ├─ __init__.py
│  │  ├─ students.py
│  │  ├─ teachers.py
│  │  ├─ admin.py
│  ├─ migrations/   (optional)
│  ├─ Dockerfile
│  └─ entrypoint.sh
├─ frontend/
│  ├─ package.json
│  ├─ public/
│  │  └─ index.html
│  ├─ src/
│  │  ├─ index.js
│  │  ├─ App.js
│  │  ├─ api.js
│  │  ├─ components/
│  │  │  ├─ auth/
│  │  │  │  ├─ Login.js
│  │  │  │  └─ Register.js
│  │  │  ├─ dashboards/
│  │  │  │  ├─ StudentDashboard.js
│  │  │  │  ├─ TeacherDashboard.js
│  │  │  │  └─ AdminDashboard.js
│  │  │  └─ shared/
│  │  │     ├─ Sidebar.js
│  │  │     └─ ProtectedRoute.js
│  ├─ Dockerfile
│  └─ .env
├─ docker-compose.yml
└─ README.md
