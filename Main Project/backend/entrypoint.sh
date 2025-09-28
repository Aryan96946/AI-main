#!/usr/bin/env bash
set -e

# wait for DB - simple approach
if [ -n "$DATABASE_URL" ]; then
  echo "Attempting DB connection..."
fi

# run migrations
flask db upgrade || echo "No migrations or db upgrade failed"

# If model not present, print warning
if [ ! -f /app/model/latest_model.joblib ]; then
  echo "Warning: model/latest_model.joblib not found. Place a trained model at that path or run train_model.py"
fi

# Start gunicorn
exec gunicorn -b 0.0.0.0:5000 "app:create_app()" --workers 3 --threads 2
