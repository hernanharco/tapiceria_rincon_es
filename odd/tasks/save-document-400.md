# Feature: save-document-400 — Fix "Error al guardar: Request failed with status code 400"

**Rama:** `fix/save-document-400` (desde `dev`)
**Creado:** 2026-10-05
**Estado:** en curso

## Problema

El cliente no puede guardar un "Nuevo Presupuesto" desde `/clientes`; el modal muestra
`Error al guardar: Request failed with status code 400`.

### Evidencia (logs `ssh hetzner-ts → docker logs tapiceria-api-1`, 04/Oct)

| Hora | Petición | Resultado |
|---|---|---|
| 12:57:10 | `POST /api/documents/` | 201 (cabecera creada) |
| 12:57:11 | `POST /api/titleDescripcion/` | 201 (título creado) |
| 12:57:11 | `POST /api/datadocuments/` | **400, body 44 bytes** |
| 12:57:18 | `POST /api/documents/` (reintento) | **400, body 74 bytes** |
| 15:16:57 | repite: 201 → 201 → **400 (44 bytes)** | mismo fallo |

### Causa raíz

1. **400 de 44 bytes** = `{"cantidad":["A valid number is required."]}`.
   La fila "Materiales" se envía con `cantidad` vacía/no numérica. En móvil el
   `input type="number"` devuelve `""` (campo limpiado o coma decimal) y
   `handleChange` guarda el string crudo sin validar. Verificado contra el DRF
   instalado: `DecimalField` + `""` → `fail('invalid')` (`fields.py:1043`).
2. **400 de 74 bytes** = `{"num_presupuesto":["document with this num_presupuesto already exists."]}`.
   El reintento re-POSTea la cabecera del intento anterior → duplicado. El guardado
   no es transaccional ni retomable → huérfanos (doc 133 en prod; 132 lo borró el usuario).
3. El toast sólo muestra `error.message` de Axios → el detalle real de DRF nunca llega al usuario.

## Alcance acordado con el usuario

- Fix **completo**: validación previa, normalización numérica, detalle real del error
  en el toast y guardado retomable (reutilizar cabecera si el 400 es por duplicado).
- Documento huérfano **PRE250117 (id 133): se deja** (no borrar).

## Tareas

- [x] 1. Helper `getApiErrorMessage` y mostrar el detalle real del backend en los toasts del guardado. — Evidencia: RED→GREEN, 8 tests (`apiErrorMessage.test.ts`).
- [x] 2. Validación previa en `handleSave` (fecha, cliente, num y filas numéricas) **antes** de crear la cabecera, con mensaje que apunte a grupo/fila/campo — test-first. — Evidencia: `documentSaveValidation.test.ts`, RED→GREEN.
- [x] 3. Normalización numérica de payloads de líneas (cantidad/precio/dto/importe → decimal 2) — test-first. — `toDecimal2` en `DataDocumentsProvider.addProductTable`.
- [x] 4. Guardado retomable: ante 400 por `num_presupuesto` duplicado en creación, reutilizar el documento existente (mismo cliente) en vez de fallar/recrear huérfano. — `classifyDuplicateHeader` (`duplicateHeader.ts`, 8 tests) + cableado en `handleSave`; RED→GREEN, 33 tests utils verdes.
- [x] 5. Verificación: `pnpm test` + `pnpm build` (+ lint acotado). — PASS ×2 (última pasada tras el endurecimiento): 66 tests, 0 fallos atribuibles (los 17 restantes son preexistentes de `HistoryDateRangeFilter`/`HistoryTemplate`, issue jsdom/localStorage Node 26); utils 33/33; `pnpm build` ✅ (1873 módulos); `pnpm lint` ✅ 0 problemas.
- [x] 6. Commit work-unit en la rama feature.
- [x] 7. Endurecimiento: `hasFooter` autoritativo vía `GET /api/footers/?footer_documento=` con fallback conservador (`hasFooter = true` si falla la consulta) — evita borrar líneas de un documento completo con lista local desactualizada (riesgo multi-dispositivo). 33/33 tests + esbuild/eslint OK.

## Evidencia de commits

- `2a36e04` — `fix(client): stop 400 error when saving a new document` en `fix/save-document-400` (10 archivos, +747/−10; incluye tests y documento ODD).
- `e0ad0a5` — docs(odd): hash del commit work-unit.
- `a149af6` — `fix(client): serve print.css from public/ ...` (link `/print.css` + `client/public/print.css`), verificado build 4/4.
- Push: rama `fix/save-document-400` y `dev` → `origin` (ff `6a3188d..a149af6`).
- Release: `dev` → `master` (`be33dc7`), pull de `5fafda4` remoto → `e29f16d` → push a `origin/master`.
- **Producción desplegada**: deployment `tapiceria-rincon-lq09dda06` (Production, Ready, 27s). Verificación en vivo: bundle `index-CkSD09cp.js` con los strings del fix; `/print.css` → `200 text/css`.
- No se incluyó la modificación preexistente de `docker-compose.yml` (revertida por el review nativo).

## Cierre

- Fix completo entregado y **desplegado en producción** (2026-10-05): validación previa, detalle real del error en el toast, normalización numérica, retomada ante duplicado con verificación autoritativa de footer, print.css corregido.
- CSP `script-src 'none'` reportado por el cliente: **no existe en el servidor** (verificado con curl en raíz y /clientes, UA Firefox, sin caché; sin meta CSP, sin service worker, sin CSP en el código) → inyectado en el navegador del cliente (extensión/VPN). Pendiente de confirmar con ventana privada.
- RDD clone-local: OFF (vía D) — volver con `gentle-ai review mode enable --scope clone`.
