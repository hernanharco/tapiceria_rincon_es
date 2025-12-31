# 1️⃣ Estructura recomendada del proyecto
```
myproject/
│
├─ backend/             # Django
│  ├─ Dockerfile
│  ├─ requirements.txt
│  └─ myproject/
│      ├─ settings.py
│      └─ wsgi.py
│
├─ frontend/            # Vite + React
│  ├─ Dockerfile
│  └─ package.json
│
├─ docker-compose.yml   # Opcional para local
└─ README.md
```

# 2️⃣ Dockerizar Django (Backend)

Crea backend/Dockerfile:

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

# 3️⃣ Dockerizar Vite (Frontend)

Crea frontend/Dockerfile:

```
# Usa Node.js para build
FROM node:20-alpine AS build

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage final: servidor ligero con Nginx
FROM nginx:stable-alpine

# Copiar build de Vite a carpeta de Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Exponer puerto estándar HTTP
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```


# Campos de creación en DB_Neon.tech.md

Para la creacion de la base de datos en Neon tenemos un archivo en la parte de backend para saber que se debe hacer

- Debemos de configurar el .env
- Cambiar el settings.py para que pueda tomar la informacion
- Hacer la migracione - python manage.py migrate

## Despues de las migraciones podemos utilizar DBeaver 

La configuracion seria
![alt text](image.png)

# ¿Qué necesitamos para empezar?
Antes de pasar a la acción, asegúrate de tener estos tres requisitos listos:

1. Cuentas creadas: Una cuenta en Render y otra en Vercel (ambas se pueden conectar con tu GitHub).

2. Repositorio en GitHub: Tu código debe estar subido a GitHub en uno o dos repositorios (puede ser uno para el backend y otro para el frontend, o ambos en carpetas separadas dentro de uno solo).

3. Archivos de configuración: Necesitaremos el Dockerfile que revisamos y el archivo requirements.txt actualizado.


# Fase 1: Despliegue del Backend en Render
Sigue estos pasos para poner tu API en línea:

## 1. Preparar GitHub

   - Sigue estos pasos para poner tu API en línea:

   - Preparar GitHub

## 2. Configurar el servicio en Render
1. Inicia sesión en Render.com. [Render.com](https://www.render.com)

2. Haz clic en New + y selecciona Web Service.

3. Conecta tu cuenta de GitHub y selecciona el repositorio de tu backend.

4. En la configuración:

   - Name: tapiceria_rincon_es (puedes dejar el que está).

   - Region: Frankfurt (EU Central). Es la mejor opción ya que tu base de datos Neon está en la misma región, lo que hace que todo sea mucho más rápido.

   - Branch: master (asegúrate de que en GitHub tu código principal esté en esa rama).

   - Language: Aquí es donde hay un cambio importante. No elijas Node. Debes cambiarlo a Docker. Render detectará tu archivo dockerfile automáticamente.

   - Root Directory: backend_tapiceria_api (para que use la raíz donde está el dockerfile).

   - Instance Type: Selecciona Free ($0/month).

## 3. Variables de Entorno
Haz clic en "Add Environment Variable" y añade las siguientes (copia los valores de tu archivo .env local):

| Key | Value |
| :--- | :--- |
| **DATABASE_URL** | `postgresql://neondb_owner:******@ep-little-wave-ag2pfpka.c-2.eu-central-1.aws.neon.tech/tapiceria-db?sslmode=require` |
| **SECRET_KEY** | *(Tu clave larga que tienes en el .env)* |
| **DEBUG** | `False` |
| **ALLOWED_HOSTS** | `*` |
| **USE_REMOTE_DB** | `True` |
| **CORS_ALLOWED_ORIGINS** | `http://localhost:5173` |

## 4. El paso final: Desplegar
Una vez que hayas cambiado el Language a Docker y puesto las variables, haz clic en el botón negro "Deploy Web Service".

**¿Qué pasará ahora?**

Build: Render leerá tu dockerfile, instalará Python, tus requirements.txt (incluyendo psycopg2 y decouple) y preparará el contenedor.

Logs: Verás una consola negra con letras blancas. Si todo va bien, al final dirá algo como Your service is live.

Migraciones: Recuerda que al ser una base de datos nueva en Neon, es posible que debas ejecutar las migraciones.