# Tapicería Rincón — ERP

Sistema de gestión para **Tapicería Rincón**, negocio de tapicería en Avilés, Asturias.

> 🧵 **Gestión de presupuestos, albaranes, facturas, clientes y más.**

---

## 🚀 Stack

| Frontend | Backend | Base de datos | Infraestructura |
|----------|---------|---------------|-----------------|
| React 19 + Vite | Django 4.2 + DRF | PostgreSQL 16 | Vercel (frontend) |
| React Router 7 | Python 3.11 | Neon / Dokploy | Dokploy / Hetzner (backend) |
| TanStack Query | Gunicorn | Cloudinary (imágenes) | Cloudflare (DNS + SSL) |
| Tailwind CSS 3 | WeasyPrint (PDF) | | WireGuard (VPN) |
| Vitest + RTL | | | |

## 🏗️ Arquitectura

```
┌─────────────────────────────────────────────────────┐
│                   Cliente (Navegador)                │
└──────────────┬──────────────────────────┬───────────┘
               │                          │
        ┌──────▼──────┐           ┌───────▼────────┐
        │  Vercel     │           │  Cloudflare     │
        │  Frontend   │           │  DNS + SSL      │
        │  (Vite SPA) │           │  (Proxy)        │
        └──────┬──────┘           └───────┬────────┘
               │                          │
               │  CORS                    │
               └──────────┬───────────────┘
                          │
                   ┌──────▼──────┐
                   │  Dokploy    │
                   │  (Hetzner)  │
                   │             │
              ┌────┴────┐ ┌─────┴─────┐
              │ Django  │ │ PostgreSQL│
              │ Backend │ │ DB        │
              │ :8000   │ │ :5432     │
              └─────────┘ └───────────┘
```

## 📋 Funcionalidades

- **Clientes**: CRUD completo con búsqueda y filtros
- **Presupuestos**: Creación, edición, impresión PDF
- **Albaranes**: Gestión de entregas
- **Facturas**: Generación automática desde presupuestos
- **Documentos**: Historial completo con filtros por tipo y fecha
- **Empresa**: Configuración de datos del negocio
- **PDF**: Generación de documentos profesionales con logos

## 🛠️ Desarrollo local

### Requisitos

- Node.js >= 18
- pnpm
- Python >= 3.11
- PostgreSQL (local o Docker)

### Backend

```bash
cd backend_tapiceria_api
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env  # configurar variables
python manage.py migrate
python manage.py runserver 0.0.0.0:10000
```

### Frontend

```bash
cd client
pnpm install
pnpm dev  # → http://localhost:5173
```

### Tests

```bash
cd client
pnpm test           # Una vez
pnpm test:watch     # Modo watch
```

Actualmente **33 tests** pasando.

## 🌐 Despliegue

Ver [`DEPLOY.md`](./DEPLOY.md) para guía completa de despliegue.

### Resumen

| Servicio | URL | Hosting |
|----------|-----|---------|
| Frontend | `https://tapiceria-rincon-es.vercel.app` | Vercel |
| Backend API | `https://tprapi.elrincondeharco.com/api/` | Dokploy (Hetzner) |
| Admin Django | `https://tprapi.elrincondeharco.com/admin/` | Dokploy (Hetzner) |

## 📚 Documentación adicional

| Archivo | Contenido |
|---------|-----------|
| [`DEPLOY.md`](./DEPLOY.md) | Guía de despliegue y troubleshooting |
| [`LECCIONES_APRENDIDAS.md`](./LECCIONES_APRENDIDAS.md) | Lecciones aprendidas para próximos proyectos |

## 🧪 Tests

```
 Test Files  5 passed (5)
      Tests  33 passed (33)
```

- `LoginPage.test.tsx` — 5 tests (formulario, accesibilidad, login, errores)
- `DateRangeFilter.test.tsx` — 10 tests (filtros, auto-filtro, debounce)
- `ErrorBoundary.test.tsx` — 4 tests (captura errores, UI)
- `Sidebar.test.tsx` — 7 tests (navegación, aria-labels)
- `HistoryTemplate.test.tsx` — 7 tests (búsqueda, sugerencias)

## 👤 Autor

**Hernan Harco** — [GitHub](https://github.com/hernanharco)

---

*Sistema desarrollado para Tapicería Rincón — Avilés, Asturias 🇪🇸*
