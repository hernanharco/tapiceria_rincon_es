"""
Django settings for backend_tapiceria_api project.
"""
import os
from pathlib import Path
from decouple import config, Csv
import dj_database_url

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# -----------------------
# Seguridad
# -----------------------
SECRET_KEY = config('SECRET_KEY')
DEBUG = True
ALLOWED_HOSTS = ['*']


# -----------------------
# Aplicaciones
# -----------------------
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'cloudinary_storage',
    'django.contrib.staticfiles',
    'cloudinary',
    'rest_framework',
    'corsheaders',
    'drf_spectacular',
    'mi_app',  # tu aplicación principal
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware', # Para que se vea presentable en Render
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware',  # primero
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'core.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [os.path.join(BASE_DIR, 'templates')],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'core.wsgi.application'

# -----------------------
# Base de datos
# -----------------------
USE_REMOTE_DB = config('USE_REMOTE_DB', default=True, cast=bool)

if USE_REMOTE_DB:
    # Esta línea lee automáticamente la URL de Neon de tu .env
    DATABASES = {
        'default': dj_database_url.config(
            default=config('DATABASE_URL'),
            conn_max_age=600,
            conn_health_checks=True,
            ssl_require=False  # Cambiado a False para permitir conexión local sin SSL
        )
    }
else:
    # Configuración para tu MySQL local
    DATABASES = {
        'default': {
            'ENGINE': config('DB_ENGINE'),
            'NAME': config('DB_NAME'),
            'USER': config('DB_USER'),
            'PASSWORD': config('DB_PASSWORD'),
            'HOST': config('DB_HOST'),
            'PORT': config('DB_PORT', cast=int),
        }
    }

# -----------------------
# Validación de contraseñas
# -----------------------
AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',},
]

# -----------------------
# Internacionalización
# -----------------------
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

# -----------------------
# Archivos estáticos
# -----------------------
STATIC_URL = '/static/'

# Esta es la carpeta donde Django recolectará todos los archivos estáticos
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')

# Configuración de Whitenoise para servir archivos comprimidos
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'
WHITENOISE_MANIFEST_STRICT = False  # 🚀 Evita que el servidor falle si falta un .map

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# -----------------------
# DRF & Swagger
# -----------------------
REST_FRAMEWORK = {'DEFAULT_SCHEMA_CLASS': 'drf_spectacular.openapi.AutoSchema'}

SPECTACULAR_SETTINGS = {
    'TITLE': 'API Tapicería Rincón',
    'DESCRIPTION': 'Gestión de empresas, clientes y facturas',
    'VERSION': '1.0.0',
    'SERVE_INCLUDE_SCHEMA': False,
}

# -----------------------
# CORS & CSRF (Configuración Robusta)
# -----------------------
# Leemos la cadena y nos aseguramos de que sea una lista limpia
CORS_ORIGIN_LIST = config('CORS_ALLOWED_ORIGINS', cast=Csv())

# Forzamos la limpieza de cada URL para evitar espacios invisibles
CORS_ALLOWED_ORIGINS = [origin.strip() for origin in CORS_ORIGIN_LIST if origin.strip()]

# MUY IMPORTANTE: CSRF_TRUSTED_ORIGINS debe empezar con el protocolo (http:// o https://)
CSRF_TRUSTED_ORIGINS = [origin.strip() for origin in CORS_ORIGIN_LIST if origin.strip()]

# Permitir que el frontend envíe cookies o cabeceras de autenticación
CORS_ALLOW_CREDENTIALS = True

CLOUDINARY_STORAGE = {
    'CLOUD_NAME': 'tu_name',
    'API_KEY': 'tu_key',
    'API_SECRET': 'tu_secret'
}
DEFAULT_FILE_STORAGE = 'cloudinary_storage.storage.MediaCloudinaryStorage'
