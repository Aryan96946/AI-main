FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1


WORKDIR /usr/src/app

# system deps
RUN apt-get update && apt-get install -y gcc libpq-dev build-essential default-libmysqlclient-dev && \
    rm -rf /var/lib/apt/lists/*

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

# copy code
COPY . .

# use frontend templates/static from mounted volume in docker-compose
EXPOSE 5000

CMD ["gunicorn", "--bind", "0.0.0.0:5000", "app:app", "--workers", "3", "--log-level", "info"]
