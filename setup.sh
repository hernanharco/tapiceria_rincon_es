#!/bin/bash

# Script de configuración profesional para Tapicería Rincón
echo -e "🚀 Iniciando configuración del proyecto Tapicería Rincón..."

# Colores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

command_exists() { command -v "$1" >/dev/null 2>&1; }
print_message() { echo -e "${GREEN}[INFO]${NC} $1"; }
print_warning() { echo -e "${YELLOW}[WARNING]${NC} $1"; }
print_error() { echo -e "${RED}[ERROR]${NC} $1"; }
print_step() { echo -e "${BLUE}[STEP]${NC} $1"; }

# 1. Verificar Requisitos
print_step "Verificando requisitos..."
for cmd in docker git; do
    if ! command_exists $cmd; then
        print_error "$cmd no está instalado."
        exit 1
    fi
done

# 2. Estructura de carpetas
print_step "Preparando directorios..."
mkdir -p logs backups temp

# 3. Configurar EL ÚNICO .env (En la raíz)
# Según tus instrucciones, el .env debe estar fuera para que ambos servicios lo lean
if [ ! -f ".env" ]; then
    print_message "Creando archivo .env único en la raíz..."
    cat > .env << EOF
# --- CONFIGURACIÓN DE BASE DE DATOS (NEON) ---
DB_ENGINE=django.db.backends.postgresql
DATABASE_URL=postgresql://neondb_owner:npg_TU_PASSWORD_AQUÍ@ep-little-wave-ag2pfpka-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require
DB_NAME=neondb
DB_USER=neondb_owner
DB_PASSWORD=TU_PASSWORD_AQUÍ
DB_HOST=ep-little-wave-ag2pfpka-pooler.c-2.eu-central-1.aws.neon.tech
DB_PORT=5432

# --- BACKEND SETTINGS ---
SECRET_KEY=dev-key-tapiceria-2026
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1,0.0.0.0
PORT=10000
USE_REMOTE_DB=True

# --- FRONTEND SETTINGS ---
VITE_API_URL=http://localhost:10000
EOF
    print_warning "⚠️ RECUERDA EDITAR EL ARCHIVO .env CON TUS CREDENCIALES REALES DE NEON"
else
    print_message "✅ El archivo .env ya existe en la raíz."
fi

# 4. Limpieza de contenedores antiguos
print_step "Limpiando entorno Docker..."
docker compose down --remove-orphans 2>/dev/null || true

# 5. Lanzamiento
print_step "Construyendo y levantando contenedores..."
# Usamos 'docker compose' (V2) que es el estándar actual
docker compose up --build -d

# 6. Espera y Migraciones
print_step "Esperando que el backend esté listo para migraciones..."
sleep 8
docker compose exec backend python manage.py migrate --noinput

# 7. Superusuario
print_warning "¿Deseas crear un administrador ahora? (y/n)"
read -r response
if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
    docker compose exec backend python manage.py createsuperuser
fi

print_message "🎉 ¡Todo listo!"
echo -e "${BLUE}Frontend:${NC} http://localhost:5173"
echo -e "${BLUE}Backend Admin:${NC} http://localhost:10000/admin"