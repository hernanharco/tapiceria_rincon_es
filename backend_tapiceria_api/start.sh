#!/bin/bash
set -e

# 1. Corregir posibles problemas de formato (LF vs CRLF)
# Esto es vital porque estás en Linux
echo "🔧 Ajustando entorno..."

# 2. Ejecutar migraciones
echo "🔄 Ejecutando migraciones..."
python manage.py migrate --noinput

# 3. Recolectar archivos estáticos
# Añadimos --no-post-process para evitar que WhiteNoise falle por archivos faltantes
echo "📦 Recolectando archivos estáticos..."
python manage.py collectstatic --noinput --no-post-process || true

# 4. Iniciar Gunicorn
echo "🚀 Iniciando servidor Gunicorn..."
exec gunicorn core.wsgi:application \
    --bind 0.0.0.0:$PORT \
    --workers 3 \
    --timeout 120 \
    --access-logfile - \
    --error-logfile -