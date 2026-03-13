#!/bin/bash
set -e

cd /app

export FLASK_APP=app.py
export FLASK_DEBUG=1

DB_HOST=${DB_HOST:-db}       # default Docker service name
DB_PORT=${DB_PORT:-3306}

echo "Waiting for DB at $DB_HOST:$DB_PORT..."

# Wait until MySQL is ready
while ! nc -z $DB_HOST $DB_PORT; do
  echo "DB not ready, waiting..."
  sleep 2
done

echo "DB is up! Checking configuration..."
python -c "from models import db; print('DB configured?')"

echo "Starting Flask..."
flask run --host=0.0.0.0 --port=5000
