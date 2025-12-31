¡Excelente elección! Neon.tech te va a encantar porque es muy sencillo y te quita el dolor de cabeza de que la base de datos se borre a los 30 días.

Aquí tienes los pasos exactos para configurar Neon y conectarlo a tu proyecto de Django que vas a subir a Render:

# 1. Crear la base de datos en Neon

1. Ve a [![Neon.tech](https://img.shields.io/badge/Db-Neon-00e599?style=flat-square&logo=neon&logoColor=black)](https://neon.com/) y regístrate (puedes usar tu cuenta de GitHub).

2. Crea un nuevo proyecto (ponle un nombre como tapiceria-db).

3. Selecciona la versión de PostgreSQL (la 16 o 17 está bien).

4. Elige la región más cercana a donde vayas a desplegar en Render (usualmente US East (N. Virginia)).

5. Al finalizar, te mostrará una **Connection String** (una URL larga). Asegúrate de que esté seleccionada la opción **"Pooled connection"** (activando el checkbox de Connection Pooling) y copia esa URL. Se verá algo así: postgres://usuario:password@ep-nombre-variable.us-east-1.aws.neon.tech/neondb?sslmode=require
   ![alt text](image.png)

# Modificar el Dockerfile (Optimización)

Asegúrate de que tu Dockerfile instale las dependencias necesarias para conectar con Postgres de forma robusta. Tu lista de instalación debería incluir:

```
RUN apt-get update && apt-get install -y libpq-dev gcc
RUN pip install psycopg2-binary dj-database-url gunicorn
```

como quedari el dockerfile

```
# 1. Imagen base de Python
FROM python:3.11-slim

# 2. Establecer variables de entorno
# Evita que Python genere archivos .pyc y permite ver logs en tiempo real
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# 3. Directorio de trabajo dentro del contenedor
WORKDIR /app

# 4. Instalar dependencias del sistema necesarias para PostgreSQL y compilación
RUN apt-get update && apt-get install -y \
    libpq-dev \
    gcc \
    --no-install-recommends && \
    rm -rf /var/lib/apt/lists/*

# 5. Instalar dependencias de Python
# Primero copiamos solo requirements para aprovechar la caché de Docker
COPY requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt
RUN pip install --no-cache-dir gunicorn dj-database-url  # Aseguramos que estén instalados

# 6. Copiar el resto del código del backend
COPY . /app/

# 7. Exponer el puerto que usa Render (por defecto 10000, pero usamos una variable)
ENV PORT 10000
EXPOSE 10000

# 8. Comando de inicio
# Ejecutamos migraciones y luego iniciamos Gunicorn
# Nota: "backend_tapiceria_api.wsgi" debe coincidir con el nombre de tu carpeta de configuración
CMD python manage.py migrate --noinput && \
    gunicorn backend_tapiceria_api.wsgi:application --bind 0.0.0.0:$PORT
```

# Pasos para conectarme con DBeaver

1. Dónde encontrar las credenciales
   En la pantalla de tu "Project dashboard" (la última imagen), verás un botón negro arriba a la derecha que dice "Connect".

   1. Haz clic en el botón Connect.

   2. Se abrirá una ventana emergente. Allí debes buscar:

      - **Database:** Por defecto suele ser neondb.

      - **User:** Tu nombre de usuario.

      - **Password:** Haz clic en el icono del "ojo" para ver la contraseña.

      - **Host:** Será algo como ep-nombre-variable.eu-central-1.aws.neon.tech.

2. Para DBeaver (Conexión Directa)
   Dentro de esa misma ventana de Connect:

   - Asegúrate de que la opción "Connection pooling" esté DESACTIVADA (off). DBeaver prefiere la conexión directa al puerto 5432.

   - Copia los datos de Host, User y Password en los campos de PostgreSQL en DBeaver.

   - Importante: Recuerda ir a la pestaña SSL en DBeaver y marcar "Use SSL" con el modo "require".

3. Variable de Entorno .env para Conectar con Neon
   1. En setting.py debemos de colocar

````
from decouple import config, Csv
import dj_database_url

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
            ssl_require=True
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
````

y en la parte de .env colocamos

```
# --- Seguridad ---
SECRET_KEY=django-insecure-%$@l3mlar3v=q4m8)5a=!erk+ujpz151b^gewgz8x@8ot&+m$b
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# --- Control de Base de Datos ---
# True = Usa Neon (Remoto) | False = Usa MySQL (Local)
USE_REMOTE_DB=True

# --- Base de Datos LOCAL (MySQL) ---
DB_ENGINE=django.db.backends.mysql
DB_NAME=db_tapiceria_es
DB_USER=root
DB_PASSWORD=
DB_HOST=127.0.0.1
DB_PORT=3306

# --- Base de Datos REMOTA (Neon.tech) ---
# Hemos borrado Render y puesto la URL de Neon aquí:
# Para ubicar esta informacion mira el paso dos y copiar la informacion que aparece en psql
DATABASE_URL=postgresql://neondb_owner:[contraseña que se da en NEON]@ep-little-wave-ag2pfpka.c-2.eu-central-1.aws.neon.tech/tapiceria-db?sslmode=require

# --- CORS ---
CORS_ALLOWED_ORIGINS=http://localhost:5173,https://tapiceria-backend.onrender.com
```
