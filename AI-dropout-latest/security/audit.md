Security Audit - AiDropout (high level)

- Passwords: stored using bcrypt with a sufficiently strong cost (Flask-Bcrypt default).
- Authentication: JWT (access + refresh pattern recommended). Rotate keys regularly and store secrets securely.
- DB: Use parameterized queries via SQLAlchemy ORM (prevents SQL injection).
- Transport: Use TLS (terminate at nginx or load balancer) — docker-compose uses plain HTTP for dev only.
- CORS: Not enabled in this skeleton. Lock down CORS in production to trusted origins.
- Secrets management: Do NOT commit SECRET_KEY or DB passwords to repo. Use environment variables or secret manager.
- Container hardening:
  - Use non-root user for containers (not done in this skeleton for brevity).
  - Keep base images updated and minimal.
- Logging & Monitoring: Add centralized logs & alerting in production.
- Rate limiting & brute force protection: Consider Flask-Limiter or API gateway rules for login endpoints.
