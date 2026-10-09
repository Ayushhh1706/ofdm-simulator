import os
from pathlib import Path
import dj_database_url

BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = os.environ.get('SECRET_KEY', 'ofdm-simulator-project-key')
DEBUG = os.environ.get('DEBUG', 'True') == 'True'
ALLOWED_HOSTS = ['*']  # tighten later to your Render domain

INSTALLED_APPS = [
    'django.contrib.contenttypes',
    'django.contrib.auth',
    'django.contrib.sessions',
    'corsheaders',
    'simulator',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
]

ROOT_URLCONF = 'ofdm_backend.urls'
TEMPLATES = []

STATIC_URL = '/static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'

DATABASES = {
    'default': dj_database_url.config(
        default=f'sqlite:///{BASE_DIR / "db.sqlite3"}'
    )
}

LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'Asia/Kolkata'
USE_I18N = True
USE_TZ = True

FRONTEND_URL = os.environ.get('FRONTEND_URL', '')
CORS_ALLOWED_ORIGINS = [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
]
if FRONTEND_URL:
    CORS_ALLOWED_ORIGINS.append(FRONTEND_URL)
    CSRF_TRUSTED_ORIGINS = [FRONTEND_URL]

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'