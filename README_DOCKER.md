# 🐳 Docker Setup para Tapicería Rincón

Este documento explica cómo configurar y ejecutar el proyecto completo usando Docker y Docker Compose.

## 📋 Requisitos Previos

- [Docker](https://docs.docker.com/get-docker/) (versión 20.10 o superior)
- [Docker Compose](https://docs.docker.com/compose/install/) (versión 2.0 o superior)
- [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)

## 🚀 Configuración Rápida

### Opción 1: Usar el script automático (Recomendado)

```bash
# Clonar el repositorio
git clone <URL_DEL_REPOSITORIO>
cd tapiceria_rincon_es

# Ejecutar el script de configuración
./setup.sh
```

El script automáticamente:

- ✅ Verifica los requisitos previos
- ✅ Crea los archivos de configuración necesarios
- ✅ Construye y levanta los contenedores
- ✅ Ejecuta las migraciones de la base de datos
- ✅ Te guía en la creación de un superusuario

### Opción 2: Configuración Manual

1. **Crear variables de entorno**

   Backend (`./backend_tapiceria_api/.env`):

   ```env
   DATABASE_URL=postgresql://user:password@localhost:5432/tapiceria_db
   SECRET_KEY=your-secret-key-here-change-in-production
   DEBUG=True
   ALLOWED_HOSTS=localhost,127.0.0.1,backend,0.0.0.0
   CORS_ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
   PORT=10000
   ```

   Frontend (`./client/.env`):

   ```env
   VITE_API_URL=http://localhost:10000/api
   ```

2. **Levantar los servicios**

   ```bash
   docker-compose up --build -d
   ```

3. **Ejecutar migraciones**

   ```bash
   docker-compose exec backend python manage.py migrate
   ```

4. **Crear superusuario (opcional)**
   ```bash
   docker-compose exec backend python manage.py createsuperuser
   ```

## 🏗️ Arquitectura de Contenedores

### Servicios Configurados

1. **Backend** (`tapiceria_backend`)
   - Django REST API
   - Puerto: 10000
   - Base: Python 3.11-slim

2. **Frontend** (`tapiceria_frontend`)
   - React + Vite
   - Puerto: 5173
   - Base: Node.js 18-alpine

3. **Base de Datos** (`tapiceria_db`)
   - PostgreSQL 15
   - Puerto: 5432
   - Volumen persistente para datos

### Redes y Volúmenes

- **Red**: `tapiceria_network` (bridge)
- **Volumen**: `postgres_data` (para persistencia de la base de datos)

## 🌐 Acceso a los Servicios

| Servicio      | URL                          | Descripción              |
| ------------- | ---------------------------- | ------------------------ |
| Frontend      | http://localhost:5173        | Aplicación web principal |
| Backend API   | http://localhost:10000/api   | API REST de Django       |
| Base de Datos | localhost:5432               | PostgreSQL               |
| Admin Django  | http://localhost:10000/admin | Panel de administración  |

## 🛠️ Comandos Útiles

### Gestión de Contenedores

```bash
# Levantar todos los servicios
docker-compose up -d

# Levantar con reconstrucción
docker-compose up --build -d

# Ver estado de los contenedores
docker-compose ps

# Ver logs en tiempo real
docker-compose logs -f

# Ver logs de un servicio específico
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f db

# Detener todos los servicios
docker-compose down

# Reiniciar servicios
docker-compose restart

# Detener y eliminar volúmenes (¡cuidado! se pierden datos)
docker-compose down -v
```

### Desarrollo

```bash
# Acceder al contenedor del backend
docker-compose exec backend bash

# Acceder al contenedor de la base de datos
docker-compose exec db psql -U user -d tapiceria_db

# Ejecutar migraciones
docker-compose exec backend python manage.py migrate

# Crear superusuario
docker-compose exec backend python manage.py createsuperuser

# Recolectar archivos estáticos
docker-compose exec backend python manage.py collectstatic --noinput
```

### Base de Datos

```bash
# Conectar a PostgreSQL
docker-compose exec db psql -U user -d tapiceria_db

# Hacer backup de la base de datos
docker-compose exec db pg_dump -U user tapiceria_db > backup.sql

# Restaurar backup
docker-compose exec -T db psql -U user tapiceria_db < backup.sql
```

## 🔧 Configuración Avanzada

### Variables de Entorno

Puedes modificar las siguientes variables según necesites:

**Backend:**

- `DATABASE_URL`: URL de conexión a la base de datos
- `SECRET_KEY`: Clave secreta de Django
- `DEBUG`: Modo debug (True/False)
- `ALLOWED_HOSTS`: Hosts permitidos
- `CORS_ALLOWED_ORIGINS`: Orígenes permitidos para CORS

**Frontend:**

- `VITE_API_URL`: URL de la API del backend

### Personalización del Docker Compose

Para modificar la configuración:

1. **Cambiar puertos**: Modifica la sección `ports` en `docker-compose.yml`
2. **Cambiar imágenes**: Modifica la sección `image` o el contexto de `build`
3. **Agregar volúmenes**: Añade secciones `volumes` según necesites

## 🐛 Solución de Problemas

### Problemas Comunes

1. **Puertos en uso**

   ```bash
   # Ver qué procesos usan los puertos
   sudo lsof -i :5173
   sudo lsof -i :10000
   sudo lsof -i :5432
   ```

2. **Problemas de permisos**

   ```bash
   # Asegurar que el script tiene permisos de ejecución
   chmod +x setup.sh
   ```

3. **Contenedores no inician**

   ```bash
   # Ver logs detallados
   docker-compose logs --tail=50

   # Reconstruir desde cero
   docker-compose down --volumes
   docker-compose up --build
   ```

4. **Problemas con la base de datos**

   ```bash
   # Reiniciar solo la base de datos
   docker-compose restart db

   # Verificar conexión
   docker-compose exec db pg_isready -U user
   ```

### Limpieza

Para limpiar completamente el entorno Docker:

```bash
# Detener y eliminar contenedores
docker-compose down --remove-orphans

# Eliminar imágenes no utilizadas
docker image prune -f

# Eliminar volúmenes no utilizados (¡cuidado! se pierden datos)
docker volume prune -f
```

## 📝 Notas Importantes

1. **Producción**: Para despliegue en producción, modifica las variables de entorno para usar valores seguros y configura HTTPS.
2. **Backups**: Realiza backups regulares de la base de datos usando los comandos proporcionados.
3. **Actualizaciones**: Cuando actualices el código, usa `docker-compose up --build` para reconstruir las imágenes.
4. **Recursos**: Asegúrate de tener suficiente RAM y espacio en disco para los contenedores.

## 🤝 Soporte

Si encuentras problemas o tienes preguntas:

1. Revisa los logs con `docker-compose logs`
2. Verifica que todos los requisitos previos estén instalados
3. Asegúrate de que los puertos no estén en uso
4. Consulta la documentación oficial de Docker y Django

---

🛋️ **¡Disfruta tu aplicación de Tapicería Rincón con Docker!**
