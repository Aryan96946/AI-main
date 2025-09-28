FROM nginx:stable-alpine
COPY static /usr/share/nginx/html/static
COPY templates/index.html /usr/share/nginx/html/index.html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
