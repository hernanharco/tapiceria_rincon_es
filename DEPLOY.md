# Deploy - Tapicería Rincón ERP

## Arquitectura

```
Frontend (Vite/React) → Vercel → tprapi.elrincondeharco.com
Backend (Django/DRF)  → Dokploy (Hetzner) → api subdominio
Base de datos (PostgreSQL) → Dokploy (Hetzner)
authCore (FastAPI)    → Dokploy (Hetzner)
Website (Next.js)     → Vercel → www.elrincondeharco.com
```

## Stack

| Componente | Tecnología | Puerto | Hosting |
|-----------|-----------|--------|---------|
| Frontend ERP | React 19 + Vite | 5173 (dev) | Vercel |
| Backend API | Django 4.2 + DRF | 8000 | Dokploy (Hetzner) |
| Base de datos | PostgreSQL 16 | 5432 | Dokploy (Hetzner) |
| authCore | FastAPI | 8000 | Dokploy (Hetzner) |
| Website | Next.js 15 | 9002 (dev) | Vercel |
| Proxy reverso | Traefik | 80/443 | Dokploy (Hetzner) |

## URLs

| Servicio | URL |
|----------|-----|
| Frontend ERP | `https://tapiceria-rincon-es-kezt.vercel.app` |
| Backend API | `https://tprapi.elrincondeharco.com/api/` |
| Admin Django | `https://tprapi.elrincondeharco.com/admin/` |
| Website | `https://www.elrincondeharco.com` |
| Dokploy | `http://10.0.0.1:3000` (via VPN) |
| Servidor Hetzner | `178.104.93.84` |

## Despliegue del Backend en Dokploy

### Configuración de la app

1. En Dokploy, crear nueva aplicación Docker
2. **Build Path**: `backend_tapiceria_api`
3. **Dockerfile**: `dockerfile`
4. **Docker Context Path**: `backend_tapiceria_api`
5. **Puerto**: `8000`

### Variables de entorno requeridas

```env
PORT=8000
USE_REMOTE_DB=False
DB_ENGINE=django.db.backends.postgresql
DB_NAME=tapiceria_db
DB_USER=postgres
DB_PASSWORD=tu_password_segura
DB_HOST=infraestructuraglobal-dbglobal-x1wtan
DB_PORT=5432
SECRET_KEY=una-clave-segura-aqui
DEBUG=False
ALLOWED_HOSTS=*
CORS_ALLOWED_ORIGINS=http://localhost:5173,https://tprapi.elrincondeharco.com,https://tapiceria-frontend.vercel.app
CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret
```

> **IMPORTANTE**: `DB_HOST` debe usar el nombre del servicio Docker (`infraestructuraglobal-dbglobal-x1wtan`), NO la IP. Las IPs cambian cuando Dokploy reinicia los contenedores.

### Dominio en Dokploy

```yaml
Host: tprapi.elrincondeharco.com
Path: /
Internal Path: /
Port: 8000
HTTPS: sí (letsencrypt)
```

### DNS en Cloudflare

| Tipo | Nombre | Valor | Proxy |
|------|--------|-------|-------|
| A | `tprapi` | `178.104.93.84` | ☁️ Proxied |
| A | `*.elrincondeharco.com` | `178.104.93.84` | ☁️ Proxied |

## Solución de problemas comunes

### 1. Backend devuelve 500 al acceder desde el navegador

**Síntoma**: `GET /api/companies/` → `500 Server Error` solo desde el navegador (curl funciona bien).

**Causa**: Django REST Framework intenta renderizar HTML cuando el navegador envía `Accept: text/html`, y falla con `DEBUG=False`.

**Solución**: Forzar JSON siempre, ignorando el Accept header del navegador:

```python
# core/negotiation.py
from rest_framework.negotiation import DefaultContentNegotiation
from rest_framework.renderers import JSONRenderer

class ForceJSONNegotiation(DefaultContentNegotiation):
    def select_renderer(self, request, renderers, format_suffix):
        return (JSONRenderer(), 'application/json')

# core/settings.py
REST_FRAMEWORK = {
    'DEFAULT_SCHEMA_CLASS': 'drf_spectacular.openapi.AutoSchema',
    'DEFAULT_RENDERER_CLASSES': [
        'rest_framework.renderers.JSONRenderer',
    ],
    'DEFAULT_CONTENT_NEGOTIATION_CLASS': 'core.negotiation.ForceJSONNegotiation',
}
```

### 2. Backend crashea al conectar a la DB

**Síntoma**: El contenedor se reinicia constantemente. Logs muestran `OperationalError: connection to server at "10.0.1.xxx", port 5432 failed`.

**Causa**: La IP de la base de datos cambia cuando Dokploy reinicia el contenedor de PostgreSQL.

**Solución**: Usar el nombre del servicio Docker en lugar de la IP:

```env
DB_HOST=infraestructuraglobal-dbglobal-x1wtan  # ✅ fijo
DB_HOST=10.0.1.123                               # ❌ cambia al reiniciar
```

### 3. Servidor Hetzner se queda sin memoria

**Síntoma**: Dokploy va muy lento, SSH no responde, solo ping funciona.

**Causa**: El servidor tiene solo 3.7GB de RAM y múltiples servicios compitiendo.

**Solución**: 
- Aumentar swap: `fallocate -l 4G /swapfile && mkswap /swapfile && swapon /swapfile`
- Desactivar servicios no esenciales: Appointment, Portfolio, etc.
- Monitorear con `free -h` y `docker ps`

### 4. Error 502 Bad Gateway desde Cloudflare

**Síntoma**: Cloudflare muestra `Error 502 Bad Gateway`.

**Causa**: Traefik no está corriendo o el contenedor del backend está caído.

**Solución**:
```bash
# Verificar Traefik
docker ps | grep traefik
# Arrancar Traefik
docker start dokploy-traefik
# Verificar backend
docker ps | grep tapiceria
# Ver logs del backend
docker logs $(docker ps --format "{{.Names}}" | grep tapiceria | head -1)
```

### 5. Los datos no aparecen en la API

**Síntoma**: `GET /api/companies/` devuelve `[]`.

**Causa**: La base de datos se recreó sin los datos originales.

**Solución**: Restaurar desde dump:
```bash
# En la máquina local
pg_dump -h localhost -U postgres -d tapiceria_db --data-only \
  --table=data_company --table=data_client --table=document \
  --table=data_document --table=footer_document --table=pago \
  --table=title_descripcion --no-owner > /tmp/data.sql

# Transferir y restaurar
scp /tmp/data.sql root@10.0.0.1:/tmp/
ssh root@10.0.0.1
docker cp /tmp/data.sql <db_container>:/tmp/
docker exec <db_container> psql -U postgres -d tapiceria_db -f /tmp/data.sql
```

## Despliegue del Frontend en Vercel

### Configuración

| Campo | Valor |
|-------|-------|
| Root Directory | `client` |
| Framework | Vite |
| Build Command | `pnpm build` |
| Output Directory | `dist` |
| Production Branch | `dev` |

### Variables de entorno

```env
VITE_API_URL=https://tprapi.elrincondeharco.com
```

### Notas

- El frontend se construye como sitio estático en `dist/`
- Vercel lo sirve en CDN global
- El API_URL debe apuntar al backend en Dokploy

## Comandos útiles

```bash
# VPN a Hetzner
sudo wg-quick up /home/harco/.wireguard/wg-hetzner.conf

# Acceso al servidor
ssh root@10.0.0.1

# Logs del backend
docker logs $(docker ps --format "{{.Names}}" | grep tapiceria | head -1) --tail 50

# Logs de Traefik
docker logs dokploy-traefik --tail 20

# Recursos del servidor
free -h && df -h /

# Puertos del backend
docker service ls | grep tapiceria
```
