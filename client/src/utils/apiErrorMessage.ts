// Helpers to turn Axios/DRF error payloads into user-facing messages.

interface FieldErrorEntry {
  [field: string]: unknown;
}

const isNonEmptyString = (value: unknown): value is string =>
  typeof value === 'string' && value.trim().length > 0;

/**
 * Extracts a readable message from an API (Axios/DRF) error.
 *
 * - `response.data` as string → returned as-is.
 * - `response.data` as `{ detail: "..." }` → returns `detail`.
 * - `response.data` as a DRF field-error object `{ field: ["msg", ...] }`
 *   → returns a single line like `cantidad: A valid number is required.`,
 *   joining multiple fields with `; `.
 * - Anything else → `fallback`.
 */
export function getApiErrorMessage(
  error: unknown,
  fallback = 'Error desconocido',
): string {
  const data = (error as { response?: { data?: unknown } } | null)?.response
    ?.data;

  if (typeof data === 'string') {
    return data.trim() || fallback;
  }

  if (data && typeof data === 'object' && !Array.isArray(data)) {
    const body = data as FieldErrorEntry;

    if (isNonEmptyString(body.detail)) {
      return body.detail;
    }

    // DRF field errors: { field: ["msg", ...], ... }
    const parts: string[] = [];
    for (const [field, value] of Object.entries(body)) {
      if (Array.isArray(value)) {
        const messages = value.filter(isNonEmptyString).join(', ');
        if (messages) parts.push(`${field}: ${messages}`);
      }
    }
    if (parts.length > 0) return parts.join('; ');
  }

  return fallback;
}
