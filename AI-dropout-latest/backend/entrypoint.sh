#!/usr/bin/env bash
# wait-for-db (simple loop)
set -e
host='db'
until python - <<'PY'
import time,sys,pymysql
for _ in range(30):
    try:
        import pymysql
        conn = pymysql.connect(host='db', user='appuser', password='apppass', db='aidropout', connect_timeout=2)
        conn.close()
        print("db ok")
        sys.exit(0)
    except Exception as e:
        print("waiting for db...")
        time.sleep(2)
print("couldn't connect")
sys.exit(1)
PY

# run migrations (if any)
flask db upgrade || true

# start server (Gunicorn defined in Dockerfile CMD)
exec "$@"
