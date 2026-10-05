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

- `085021b` — `fix(client): stop 400 error when saving a new document` en `fix/save-document-400` (10 archivos, +747/−10; incluye tests y documento ODD). No se incluyó la modificación preexistente de `docker-compose.yml`. No push/PR (decisión del usuario).

## Cierre

- Fix completo entregado: validación previa, detalle real del error en el toast, normalización numérica, retomada ante duplicado con verificación autoritativa de footer.
- Pendiente solo del usuario: desplegar (Vercel) y comentar con el cliente.
