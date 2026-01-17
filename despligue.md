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

# Fase 2: El Frontend (Vite + React)

Ahora que el backend está vivo, necesitamos que tu aplicación de React sepa a dónde llamar.

## 1. Actualizar la URL de la API en el Frontend
Busca en tu código de Vite (probablemente en un archivo .env del frontend o donde configures Axios/Fetch) y cambia la URL local por la de Render:

- Antes: http://localhost:8000/api

- Ahora: https://tapiceria-rincon-es.onrender.com/api (ajusta según tus rutas).

## 2. Configurar CORS en el Backend (Importante)
Para que el navegador permita que tu web (Vercel) hable con tu servidor (Render), debemos autorizar la futura URL.

1. Ve al panel de Render de tu servicio tapiceria-rincon-es.

2. Entra en Environment.

3. Busca CORS_ALLOWED_ORIGINS y, por ahora, asegúrate de que tenga al menos una URL (luego pondremos la de Vercel). Si quieres permitir todo temporalmente para probar, puedes usar la variable CORS_ALLOW_ALL_ORIGINS = True (solo para pruebas rápidas). o Busca la variable CORS_ALLOWED_ORIGINS y asegúrate de que incluya tu dirección local:

**http://localhost:5173,http://127.0.0.1:5173**

## 3. Prueba de fuego - Correr el programa en local

**Estás trabajando con lo que llamamos un Entorno de Staging Híbrido.**

Una vez realizados estos dos cambios:

1. En tu terminal del frontend, ejecuta: npm run dev.

2. Abre la aplicación en el navegador.

3. Si tenías datos cargados en Neon (vía DBeaver o el Admin de Django), deberían aparecer ahora mismo en tu web de Vite.

**¿Por qué esto es tan útil para ti ahora?**

- **Datos Reales:** Todo lo que guardes desde tu PC mientras programas, se queda guardado en Neon. Si cierras la laptop y te vas a otro sitio, los datos siguen ahí.

- **Depuración Fácil:** Si algo falla, puedes ver los errores en la terminal de tu VS Code (frontend) y en los logs de Render (backend) al mismo tiempo.

- **Cero sorpresas:** Si funciona así, funcionará al 100% cuando subas el frontend a Vercel, porque ya probaste la conexión a través de internet.

## 3. Despliegue en Vercel
Vercel es súper sencillo para Vite:

1. Entra en Vercel.com y dale a "Add New Project".

2. Importa el repositorio donde tienes tu carpeta client (el frontend).

3. Configuración crucial:

   - Root Directory: Si tu frontend está en una carpeta llamada client, asegúrate de seleccionarla como Root Directory.

   - Build Command: npm run build o vite build.

   - Output Directory: dist.

----
## 1. Preparación del repositorio
Asegúrate de que tu carpeta del frontend (donde está el package.json de Vite) esté subida a GitHub. Si el frontend está en una carpeta llamada client o frontend dentro de tu repositorio principal, no hay problema, Vercel permite seleccionar esa subcarpeta.

## 2. Importar en Vercel
1. Ve a Vercel.com e inicia sesión con tu cuenta de GitHub.

2. Haz clic en "Add New" > "Project".

3. Busca tu repositorio tapiceria_rincon_es y dale a "Import".

4. Configuración de Carpeta: Si tu frontend no está en la raíz, busca la sección "Root Directory" y selecciona la carpeta específica del frontend.

## 3. Configurar Variables de Entorno (Crucial)

Antes de darle a "Deploy", despliega la sección "Environment Variables". Aquí es donde conectamos el frontend con el backend que acabamos de subir a Render:

Variable: VITE_API_URL

Valor: https://tapiceria-****-es.onrender.com

Nota: No pongas la barra / al final de la URL a menos que tu código de Axios/Fetch lo requiera específicamente.

## 4. Lanzar el Despliegue
Haz clic en "Deploy". Vercel instalará las dependencias y construirá tu sitio en menos de un minuto. Cuando termine, te dará una URL parecida a tapice******-es.vercel.app.

## 5. El toque final: Autorizar a Vercel en Render
Para que tu backend acepte las llamadas de tu nueva web, debemos añadir la URL de Vercel a la "lista blanca" de Django:

Copia la URL que te dio Vercel (ej: https://tapiceria-******.vercel.app).

Ve a tu panel de Render > Environment.

En la variable CORS_ALLOWED_ORIGINS, añade una coma al final de lo que ya tienes y pega la nueva URL:

Ejemplo: http://localhost:5173,https://tapiceria-******.vercel.app.

Guarda los cambios en Render.