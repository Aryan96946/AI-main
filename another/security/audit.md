Security notes:
- Use HTTPS and strong JWT secret keys for production.
- Limit admin endpoints and enable logging.
- Sanitize user inputs and apply CORS as needed.
- Use MySQL user with least privilege; in Docker compose we used ai_user:ai_pass.
- Run OWASP ZAP or Snyk scans placed in this folder as desired.
