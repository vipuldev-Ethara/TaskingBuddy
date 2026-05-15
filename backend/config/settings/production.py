from .base import *
import dj_database_url
import os

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = False

# Allowed hosts — Railway injects RAILWAY_PUBLIC_DOMAIN automatically
_allowed = os.environ.get('ALLOWED_HOSTS', '')
_railway_domain = os.environ.get('RAILWAY_PUBLIC_DOMAIN', '')
_railway_private = os.environ.get('RAILWAY_PRIVATE_DOMAIN', '')

ALLOWED_HOSTS = [h.strip() for h in _allowed.split(',') if h.strip()]
if _railway_domain:
    ALLOWED_HOSTS.append(_railway_domain)
if _railway_private:
    ALLOWED_HOSTS.append(_railway_private)

# Always allow localhost for health-checks and inter-service calls
ALLOWED_HOSTS += ['localhost', '127.0.0.1', '0.0.0.0']

# Database — Railway injects DATABASE_URL automatically when you add PostgreSQL
DATABASES = {
    'default': dj_database_url.config(
        default=os.environ.get('DATABASE_URL', f"sqlite:///{BASE_DIR / 'db.sqlite3'}"),
        conn_max_age=600,
        conn_health_checks=True,
    )
}

# CORS — allow frontend Railway domain
# We use CORS_ALLOW_ALL_ORIGINS=True initially; restrict once you know the frontend URL
_cors_origins = os.environ.get('CORS_ALLOWED_ORIGINS', '')
if _cors_origins.strip():
    CORS_ALLOWED_ORIGINS = [o.strip() for o in _cors_origins.split(',') if o.strip()]
else:
    # If not set yet, allow all (safe to restrict after first successful deploy)
    CORS_ALLOW_ALL_ORIGINS = True

CORS_ALLOW_CREDENTIALS = True

# Disable SSL redirect — Railway's proxy handles HTTPS termination
SECURE_SSL_REDIRECT = False
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')
SECURE_BROWSER_XSS_FILTER = True
SECURE_CONTENT_TYPE_NOSNIFF = True

# Whitenoise for static files
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'
