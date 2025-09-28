import os
import urllib.parse

class Config:
    # Flask settings
    DEBUG = os.getenv("FLASK_DEBUG", "True") == "True"
    SECRET_KEY = os.getenv("SECRET_KEY", "your_secret_key_here")
    
    # MySQL settings
    MYSQL_USER = os.getenv("MYSQL_USER", "user")
    MYSQL_PASSWORD = os.getenv("MYSQL_PASSWORD", "userpassword")
    MYSQL_HOST = os.getenv("MYSQL_HOST", "mysql")
    MYSQL_PORT = os.getenv("MYSQL_PORT", "3306")
    MYSQL_DB = os.getenv("MYSQL_DB", "dropout_db")
    
    # Encode password to handle special characters
    MYSQL_PASSWORD_ENCODED = urllib.parse.quote_plus(MYSQL_PASSWORD)
    
    # SQLAlchemy Database URI
    SQLALCHEMY_DATABASE_URI = (
        f"mysql+pymysql://{MYSQL_USER}:{MYSQL_PASSWORD_ENCODED}@{MYSQL_HOST}:{MYSQL_PORT}/{MYSQL_DB}"
    )
    
    # SQLAlchemy settings
    SQLALCHEMY_TRACK_MODIFICATIONS = False
