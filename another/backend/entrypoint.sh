#!/bin/bash
# Wait for DB to be ready (simple loop)
echo "Waiting for DB..."
while ! python - <<'PY'
import sys, pymysql, os
try:
    import pymysql
    from urllib.parse import urlparse
    db_url = os.environ.get('DATABASE_URL')
    if not db_url:
        sys.exit(0)
    print("Trying to connect to DB...")
    # parse DATABASE_URL like mysql+pymysql://user:pass@host:3306/dbname
    from sqlalchemy.engine.url import make_url
    url = make_url(db_url)
    conn = pymysql.connect(host=url.host, user=url.username, passwd=url.password, db=url.database, port=url.port or 3306, connect_timeout=3)
    conn.close()
except Exception as e:
    print("DB not ready: ", e)
    sys.exit(1)
else:
    sys.exit(0)
PY
do
  sleep 2
done

# Run migrations if available
flask db upgrade || true

# Start the app (gunicorn configured in Dockerfile)
exec "$@"
