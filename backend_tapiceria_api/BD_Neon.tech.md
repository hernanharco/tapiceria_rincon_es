¡Excelente elección! Neon.tech te va a encantar porque es muy sencillo y te quita el dolor de cabeza de que la base de datos se borre a los 30 días.

Aquí tienes los pasos exactos para configurar Neon y conectarlo a tu proyecto de Django que vas a subir a Render:

# 1. Crear la base de datos en Neon
1. Ve a [![Neon.tech](https://img.shields.io/badge/Db-Neon-00e599?style=flat-square&logo=neon&logoColor=black)](https://neon.com/) y regístrate (puedes usar tu cuenta de GitHub).

3. Crea un nuevo proyecto (ponle un nombre como tapiceria-db).

4. Selecciona la versión de PostgreSQL (la 16 o 17 está bien).

5. Elige la región más cercana a donde vayas a desplegar en Render (usualmente US East (N. Virginia)).

6. Al finalizar, te mostrará una **Connection String** (una URL larga). Asegúrate de que esté seleccionada la opción **"Pooled connection"** (activando el checkbox de Connection Pooling) y copia esa URL. Se verá algo así: postgres://usuario:password@ep-nombre-variable.us-east-1.aws.neon.tech/neondb?sslmode=require