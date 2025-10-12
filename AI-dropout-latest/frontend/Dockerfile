FROM nginx:alpine

# Remove default nginx files
RUN rm -rf /usr/share/nginx/html/*

# Copy templates (HTML pages)
COPY templates/ /usr/share/nginx/html/

# Copy static assets
COPY static/ /usr/share/nginx/html/static/

# Copy nginx config (adjust path if needed)
COPY ../nginx/nginx.conf /etc/nginx/conf.d/default.conf
