from .base import *
import dj_database_url
import os

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = False

# Allowed hosts configured via environment variable
# Railway injects RAILWAY_PUBLIC_DOMAIN automatically
_allowed = os.environ.get('ALLOWED_HOSTS', '')
_railway_domain = os.environ.get('RAILWAY_PUBLIC_DOMAIN', '')

ALLOWED_HOSTS = [h.strip() for h in _allowed.split(',') if h.strip()]
if _railway_domain:
    ALLOWED_HOSTS.append(_railway_domain)

# Always allow localhost for health-checks
ALLOWED_HOSTS += ['localhost', '127.0.0.1']

# Database — Railway injects DATABASE_URL automatically when you add PostgreSQL
DATABASES = {
    'default': dj_database_url.config(
        default=os.environ.get('DATABASE_URL', 'sqlite:///db.sqlite3'),
        conn_max_age=600,
        conn_health_checks=True,
    )
}

# CORS — allow your Railway frontend domain
_cors_origins = os.environ.get('CORS_ALLOWED_ORIGINS', '')
CORS_ALLOWED_ORIGINS = [o.strip() for o in _cors_origins.split(',') if o.strip()]
CORS_ALLOW_CREDENTIALS = True

# Disable SSL redirect so Railway's built-in HTTPS proxy handles it
SECURE_SSL_REDIRECT = False
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')
SECURE_BROWSER_XSS_FILTER = True
SECURE_CONTENT_TYPE_NOSNIFF = True

# Whitenoise compression and caching
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'
