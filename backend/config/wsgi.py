import os

from django.core.wsgi import get_wsgi_application

# Railway sets DJANGO_SETTINGS_MODULE via env var.
# Fallback to production if not set (never falls back to development in prod).
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.production')

application = get_wsgi_application()
