FROM python:3.11-slim

WORKDIR /app

# System deps for MySQL client and build
RUN apt-get update && apt-get install -y default-libmysqlclient-dev build-essential && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

ENV FLASK_APP=app
ENV FLASK_ENV=production

CMD ["gunicorn", "--bind", "0.0.0.0:5000", "app:app"]
