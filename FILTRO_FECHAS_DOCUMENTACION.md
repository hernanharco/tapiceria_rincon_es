# Módulo de Filtrado Avanzado por Fechas

## Descripción

Se ha implementado un sistema completo de filtrado de facturas por rango de fechas con UI moderna y backend optimizado.

## Frontend (React)

### Componente: `DateRangeFilter.jsx`

**Ubicación:** `/client/src/modules/documents/components/DateRangeFilter.jsx`

**Características:**

- UI moderna con Tailwind CSS
- Dos inputs de fecha (inicio y fin)
- Validación de fechas (la fecha de inicio no puede ser posterior a la de fin)
- Botones de "Filtrar" y "Limpiar"
- Indicador visual del rango activo
- Estados de carga (loading)
- Responsive design
- Soporte para teclado (Enter para filtrar)

### Integración en `HistoryTemplate.jsx`

**Ubicación:** `/client/src/modules/history/HistoryTemplate.jsx`

**Cambios realizados:**

- Importación del componente `DateRangeFilter`
- Integración del hook `useDocuments` para acceder a `fetchDocumentsByDateRange`
- Funciones `handleDateFilter` y `handleClearFilter`
- El componente se renderiza antes del buscador de clientes

### Provider: `DocumentsProvider.jsx`

**Nueva función:** `fetchDocumentsByDateRange(startDate, endDate)`

**Características:**

- Formateo automático de fechas a ISO (YYYY-MM-DD)
- Manejo de estados de carga y error
- Actualización del estado global de documentos
- Integración con dayjs para manejo de fechas

## Backend (Django REST Framework)

### ViewSet: `DocumentViewSet`

**Ubicación:** `/backend_tapiceria_api/mi_app/views.py`

**Nuevos métodos:**

- `get_queryset()`: Filtra documentos por rango de fechas
- `list()`: Documentación OpenAPI para los parámetros

**Parámetros soportados:**

- `start`: Fecha de inicio (YYYY-MM-DD)
- `end`: Fecha de fin (YYYY-MM-DD)
- `search`: Búsqueda existente por número de documento

**Ejemplos de uso:**

```bash
# Filtrar por rango de fechas
GET /api/documents/?start=2024-01-01&end=2024-12-31

# Combinar con búsqueda
GET /api/documents/?start=2024-01-01&end=2024-12-31&search=PRES-0001

# Solo búsqueda (funcionalidad existente)
GET /api/documents/?search=PRES-0001
```

## Flujo de Datos

1. **Usuario selecciona fechas** en el componente `DateRangeFilter`
2. **Frontend valida** que las fechas sean correctas
3. **Llama a `fetchDocumentsByDateRange`** del provider
4. **Provider formatea** las fechas y hace petición GET al backend
5. **Backend filtra** documentos usando Django ORM
6. **Retorna JSON** con los documentos filtrados
7. **Provider actualiza** el estado global
8. **UI reacciona** automáticamente mostrando los nuevos datos

## Características Técnicas

### Frontend

- ✅ React Hooks (useState, useCallback, useEffect)
- ✅ Tailwind CSS para diseño moderno
- ✅ Manejo de estados de carga
- ✅ Validación de formularios
- ✅ Responsive design
- ✅ Accesibilidad (teclado, lectores de pantalla)
- ✅ Manejo de errores

### Backend

- ✅ Django REST Framework
- ✅ Filtros optimizados con Django ORM
- ✅ Documentación OpenAPI/Swagger
- ✅ Validación de parámetros
- ✅ Manejo de errores
- ✅ Queries optimizadas

## Uso

### Para filtrar documentos:

1. Ve a la vista de historial de documentos
2. Usa el selector de fechas en la parte superior
3. Selecciona fecha de inicio y fin
4. Click en "Filtrar" o presiona Enter
5. Los documentos se actualizarán automáticamente

### Para limpiar el filtro:

1. Click en el botón "Limpiar"
2. Los campos de fecha se vaciarán
3. Se recargarán todos los documentos

## Consideraciones

- Las fechas se envían en formato ISO (YYYY-MM-DD)
- El filtrado se basa en el campo `fecha_factura` del modelo `Document`
- El componente mantiene compatibilidad con el buscador existente
- El estado de carga se muestra durante las peticiones asíncronas
- Los errores se manejan y muestran al usuario

## Extensibilidad

El sistema está diseñado para ser fácilmente extensible:

- **Nuevos filtros:** Se pueden añadir más parámetros al `get_queryset`
- **Componentes reutilizables:** `DateRangeFilter` puede usarse en otras vistas
- **Backend escalable:** La estructura soporta consultas más complejas
- **Frontend modular:** La lógica está separada en hooks y componentes
