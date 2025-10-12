Backend Flask application.

To run locally:
1. Create virtualenv and install requirements.
2. Create database and set DATABASE_URL env var.
3. Run `python train_model.py` to generate model/dropout_model.joblib.
4. Initialize migrations: `flask db init` then `flask db migrate` then `flask db upgrade`.
5. Run: `gunicorn "app:create_app()" -b 0.0.0.0:5000`

APIs:
- POST /auth/register
- POST /auth/login
- POST /predict/student
- Admin & counsel endpoints under /admin and /counsel
