# Lecciones Aprendidas — Tapicería Rincón ERP

## Arquitectura final

```
Frontend (Vite/React) ── Vercel ── https://app.vercel.app (CDN global)
Backend (Django/DRF)  ── Dokploy ── https://api.midominio.com (Hetzner)
Base de datos (PostgreSQL) ── Dokploy ── Contenedor Docker
Proxy reverso ── Traefik (automático con Dokploy)
DNS ── Cloudflare (proxy + SSL)
```

## Checklist para el próximo proyecto

### 1. Planning inicial

- [ ] Definir stack: Frontend (Vite/React/Next.js), Backend (Django/FastAPI), DB (PostgreSQL)
- [ ] Elegir hosting: Vercel para frontend, Dokploy/Hetzner para backend
- [ ] Configurar DNS en Cloudflare ANTES de empezar
- [ ] Crear rama `dev` desde el inicio

### 2. Backend (Django)

**Configuración inicial obligatoria:**
```python
# settings.py - DRF solo JSON
REST_FRAMEWORK = {
    'DEFAULT_RENDERER_CLASSES': [
        'rest_framework.renderers.JSONRenderer',
    ],
    'DEFAULT_CONTENT_NEGOTIATION_CLASS': 'core.negotiation.ForceJSONNegotiation',
}
```

**Forzar JSON siempre** (para evitar el error 500 con `Accept: text/html`):
```python
# core/negotiation.py
from rest_framework.negotiation import DefaultContentNegotiation
from rest_framework.renderers import JSONRenderer

class ForceJSONNegotiation(DefaultContentNegotiation):
    def select_renderer(self, request, renderers, format_suffix):
        return (JSONRenderer(), 'application/json')
```

**CORS:**
- Usar `django-cors-headers`
- `CORS_ALLOWED_ORIGINS` sin barra al final (`/`)
- Incluir: `http://localhost:5173` (dev), dominio de Vercel, dominio del API

### 3. Docker + Dokploy

**Variables de entorno NUNCA usar IPs para la DB:**
```env
# ❌ MAL - la IP cambia cada vez que Dokploy reinicia el contenedor
DB_HOST=10.0.1.123

# ✅ BIEN - usar el nombre del servicio Docker (nunca cambia)
DB_HOST=infraestructuraglobal-dbglobal-x1wtan
```

**Configuración del Dockerfile:**
```dockerfile
# Usar ENV PORT para que coincida con el puerto de Dokploy
ENV PORT=8000
EXPOSE $PORT
```

**Configuración en Dokploy:**
| Campo | Valor |
|-------|-------|
| Build Path | `backend_tapiceria_api` |
| Dockerfile | `dockerfile` |
| Docker Context Path | `backend_tapiceria_api` |
| Container Port | `8000` |

### 4. Frontend (Vite + React)

**Variables de entorno:**
```env
# .env.development
VITE_API_URL=http://localhost:8000

# En Vercel (production)
VITE_API_URL=https://api.midominio.com
```

**Configuración en Vercel:**
| Campo | Valor |
|-------|-------|
| Root Directory | `client` |
| Framework | Vite |
| Build Command | `pnpm build` |
| Output Directory | `dist` |

### 5. Cloudflare

**DNS:**
| Tipo | Nombre | Valor | Proxy |
|------|--------|-------|-------|
| A | `api` | `178.104.93.84` | ☁️ Proxied |
| CNAME | `www` | `nombre.vercel.app` | ☁️ Proxied |

**Para certificados SSL:**
- Si Cloudflare está "Proxied", desactivar temporalmente ("DNS only") para que Let's Encrypt valide el dominio
- O usar Cloudflare Origin Certificate

## Problemas comunes y soluciones

### 1. 500 error desde el navegador pero curl funciona

**Causa:** El navegador envía `Accept: text/html` y DRF intenta renderizar HTML.

**Solución:** Forzar JSON siempre (ver `ForceJSONNegotiation` arriba).

### 2. CORS no funciona

**Causas posibles:**
- URL con `/` al final en `CORS_ALLOWED_ORIGINS`
- La URL de Vercel cambió (cada branch genera una URL distinta)
- El backend está corriendo código viejo (falta redeploy)

**Diagnóstico:**
```bash
curl -s -D - -o /dev/null \
  -H "Origin: https://frontend.vercel.app" \
  https://api.midominio.com/api/endpoint/ \
  | grep -i "access-control"
```

### 3. El backend crashea al iniciar

**Causas posibles:**
- La DB no está corriendo
- La IP de la DB cambió (usar nombre del servicio Docker)
- Contraseña de la DB incorrecta (resetear con `ALTER USER postgres PASSWORD 'postgres'`)

**Diagnóstico:**
```bash
# Ver logs del contenedor
docker logs $(docker ps -a --format "{{.Names}}" | grep tapiceria | head -1)
```

### 4. Servidor sin memoria (OOM)

**Síntomas:** Dokploy lento, SSH no responde, solo ping funciona.

**Prevención:**
- Detener servicios no esenciales (Appointment, Portfolio, etc.)
- Aumentar swap: `fallocate -l 4G /swapfile && mkswap /swapfile && swapon /swapfile`
- Monitorear con `free -h`

### 5. API devuelve datos vacíos

**Causa:** La DB se recreó y perdió los datos.

**Solución:** Restaurar desde dump:
```bash
pg_dump -h localhost -U postgres -d tapiceria_db --data-only \
  --table=data_company --table=data_client --table=document \
  --table=data_document --table=footer_document --table=pago \
  --table=title_descripcion --no-owner > /tmp/data.sql
```

## Flujo de deploy correcto

```
1. ✅ Backend funcionando localmente
2. ✅ Push a GitHub (rama dev)
3. ✅ Dokploy: Redeploy del backend
4. ✅ Verificar: curl https://api.midominio.com/api/
5. ✅ Vercel: Deploy del frontend
6. ✅ Verificar CORS: curl con Origin header
7. ✅ Probar en el navegador
```

## Comandos útiles

```bash
# VPN
sudo wg-quick up /home/harco/.wireguard/wg-hetzner.conf

# SSH al servidor
ssh root@10.0.0.1

# Logs del backend
docker logs $(docker ps --format "{{.Names}}" | grep tapiceria | head -1) --tail 50

# Reset contraseña DB
docker exec <db_container> psql -U postgres -c "ALTER USER postgres PASSWORD 'postgres';"

# Recursos
free -h && df -h /

# Traefik (proxy reverso - si se cae)
docker start dokploy-traefik
```

## Stack técnico final

| Componente | Tecnología | Versión |
|-----------|-----------|---------|
| Frontend | React + Vite | 19 / 6 |
| Backend | Django + DRF | 4.2 |
| Base de datos | PostgreSQL | 16 |
| Hosting frontend | Vercel | - |
| Hosting backend | Dokploy (Hetzner) | 0.28.8 |
| Proxy reverso | Traefik | 3.6 |
| DNS + SSL | Cloudflare | - |
| VPN | WireGuard | - |
| Tests | Vitest + Testing Library | 4.1 |
| Estado global | React Query (TanStack) | 5.x |
