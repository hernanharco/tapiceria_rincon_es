#!/bin/bash

set -e

# -----------------------
# Colores
# -----------------------
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

log() { echo -e "${BLUE}[INFO]${NC} $1"; }
ok() { echo -e "${GREEN}[OK]${NC} $1"; }
warn() { echo -e "${YELLOW}[AVISO]${NC} $1"; }
question() { echo -e "${YELLOW}[PREGUNTA]${NC} $1"; }

# -----------------------
# 0. Reparación de Formatos (Fix para Linux)
# -----------------------
log "Corrigiendo formatos de archivos y permisos..."
find . -name "*.sh" -exec sed -i 's/\r$//' {} +
chmod +x backend_tapiceria_api/start.sh || true 

# -----------------------
# 1. Gestión del Túnel Cloudflare
# -----------------------
log "Iniciando limpieza de contenedores previos..."
docker compose down --remove-orphans

log "Levantando túnel para detectar nueva URL..."
docker compose up -d tunnel

log "Esperando URL de Cloudflare..."
TUNNEL_URL=""
for i in {1..15}; do
    TUNNEL_URL=$(docker logs tapiceria_tunnel 2>&1 | grep -o 'https://[-a-z0-9.]*\.trycloudflare.com' | head -n 1)
    if [ ! -z "$TUNNEL_URL" ]; then break; fi
    sleep 1
done

# Guardamos el estado del .env antes de modificarlo para detectar cambios
[ -f .env ] && OLD_ENV_MD5=$(md5sum .env | cut -d' ' -f1)

if [ ! -z "$TUNNEL_URL" ]; then
    ok "URL detectada: ${TUNNEL_URL}"
    # Actualizamos el .env con la nueva URL del túnel
    sed -i "s|^VITE_API_URL=.*|VITE_API_URL=${TUNNEL_URL}|" .env
    CORS_BASE="http://localhost:5173,http://127.0.0.1:5173,http://192.168.1.45:5173"
    sed -i "s|^CORS_ALLOWED_ORIGINS=.*|CORS_ALLOWED_ORIGINS=${CORS_BASE},${TUNNEL_URL}|" .env
    sed -i "s|^ALLOWED_HOSTS=.*|ALLOWED_HOSTS=localhost,127.0.0.1,0.0.0.0,backend,192.168.1.45,.trycloudflare.com|" .env
else
    warn "No se detectó URL automática, se usarán los valores actuales del .env"
fi

# -----------------------
# 2. Reconstrucción y Hot-Reload
# -----------------------
log "Verificando dependencias..."
REQ_HASH=$(md5sum backend_tapiceria_api/requirements.txt 2>/dev/null | cut -d' ' -f1 || echo "")
LAST_HASH=$(cat .last_req_hash 2>/dev/null || echo "")

if [ "$REQ_HASH" != "$LAST_HASH" ]; then
    log "Cambios en requirements.txt detectados. Reconstruyendo imágenes..."
    docker compose build backend
    echo "$REQ_HASH" > .last_req_hash
fi

log "Levantando servicios con Volúmenes Activos..."
docker compose up -d backend frontend

# Si el .env cambió por el túnel, reiniciamos servicios para que tomen las nuevas variables
NEW_ENV_MD5=$(md5sum .env | cut -d' ' -f1)
if [ "$OLD_ENV_MD5" != "$NEW_ENV_MD5" ]; then
    log "Reiniciando servicios para aplicar cambios en .env..."
    docker compose restart backend frontend
fi

# -----------------------
# 3. Base de Datos y Migraciones
# -----------------------
log "Esperando que el Backend esté listo (5s)..."
sleep 5

question "¿Deseas ejecutar las migraciones de la base de datos? (s/n)"
read -r run_migrations
if [[ "$run_migrations" =~ ^[Ss]$ ]]; then
    log "Ejecutando migrate..."
    docker exec -it tapiceria_backend python manage.py migrate
    ok "Migraciones completadas."
fi

question "¿Deseas crear un nuevo Superusuario? (s/n)"
read -r create_user
if [[ "$create_user" =~ ^[Ss]$ ]]; then
    docker exec -it tapiceria_backend python manage.py createsuperuser
fi

# -----------------------
# 4. Verificación de Salud
# -----------------------
log "Verificando salud del sistema..."
if docker ps | grep tapiceria_backend > /dev/null; then
    ok "Contenedor Backend está CORRIENDO."
else
    RED "Error: El backend no inició correctamente."
fi

# -----------------------
# 5. Resumen Final
# -----------------------
echo -e "\n${GREEN}🎉 ENTORNO LISTO CON HOT-RELOAD${NC}"
echo "-------------------------------------------------------"
echo -e "${BLUE}DESARROLLO:${NC} Cualquier cambio en .py o .html se reflejará solo."
echo -e "${BLUE}FRONTEND:${NC} Vite está observando cambios en la carpeta client/."
echo "-------------------------------------------------------"
if [ ! -z "$TUNNEL_URL" ]; then
    echo -e "ACCESO REMOTO: ${GREEN}${TUNNEL_URL}${NC}"
fi
echo -e "ACCESO LOCAL:  ${GREEN}http://localhost:5173${NC}"
echo "-------------------------------------------------------"