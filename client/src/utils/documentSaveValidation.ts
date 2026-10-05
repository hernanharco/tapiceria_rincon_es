// Pure validation + normalization helpers for the document save flow.
// User-facing messages are in Spanish (app UI language); identifiers in English.

export interface DocumentSaveRow {
  id?: string | number;
  descripcion?: string | null;
  cantidad?: string | number | null;
  precio?: string | number | null;
  dto?: string | number | null;
  importe?: string | number | null;
  [key: string]: unknown;
}

export interface DocumentSaveInput {
  clientId: string | number | null | undefined;
  date: string | number | null | undefined;
  docNumber: string | number | null | undefined;
  rows: DocumentSaveRow[];
}

export type DocumentSaveValidation =
  | { ok: true }
  | { ok: false; message: string };

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

// Layout of `rows`: blocks of 3 — title row, then "Materiales", then "Mano de Obra".
const DETAIL_ROW_LABELS = ['Materiales', 'Mano de Obra'] as const;

const NUMERIC_FIELDS = [
  { key: 'cantidad', label: 'Cantidad' },
  { key: 'precio', label: 'Precio' },
  { key: 'dto', label: 'Dto %' },
  { key: 'importe', label: 'Importe' },
] as const;

const invalid = (message: string): DocumentSaveValidation => ({
  ok: false,
  message,
});

const isEmptyValue = (value: unknown): boolean =>
  value === null || value === undefined || String(value).trim() === '';

// "1.123" → true, "10.5" → false. Assumes value already parses as a number.
const exceedsTwoDecimals = (value: string | number): boolean => {
  const text = String(value).trim();
  const dotIndex = text.indexOf('.');
  if (dotIndex === -1) return false;
  const fraction = text.slice(dotIndex + 1);
  return fraction.length > 2 && /[0-9]/.test(fraction);
};

const validateNumericField = (
  row: DocumentSaveRow,
  field: { key: keyof DocumentSaveRow & string; label: string },
  groupNumber: number,
  rowLabel: string,
): string | null => {
  const value = row[field.key];
  const prefix = `Grupo ${groupNumber} · ${rowLabel}: "${field.label}"`;

  if (isEmptyValue(value)) {
    return `${prefix} debe ser un número (no puede quedar vacío).`;
  }

  const parsed = Number(value);
  if (!Number.isFinite(parsed)) {
    return `${prefix} debe ser un número (valor "${String(value)}" no válido).`;
  }

  if (exceedsTwoDecimals(value as string | number)) {
    return `${prefix} admite como máximo 2 decimales.`;
  }

  return null;
};

/**
 * Validates everything needed for a document save BEFORE any POST happens,
 * so a failed save never leaves an orphan header behind.
 */
export function validateDocumentSave(
  input: DocumentSaveInput,
): DocumentSaveValidation {
  const { clientId, date, docNumber, rows } = input;

  if (isEmptyValue(clientId)) {
    return invalid('Debes seleccionar un cliente antes de guardar.');
  }

  if (isEmptyValue(date)) {
    return invalid(
      'Debes rellenar el campo "Fecha Presupuesto" antes de guardar.',
    );
  }

  if (!DATE_PATTERN.test(String(date).trim())) {
    return invalid(
      'La "Fecha Presupuesto" no tiene un formato válido (AAAA-MM-DD).',
    );
  }

  if (isEmptyValue(docNumber)) {
    return invalid('Debes indicar el número de Presupuesto.');
  }

  for (let i = 0; i < rows.length; i += 1) {
    const row = rows[i];
    if (!row) continue;

    const position = i % 3;
    const groupNumber = Math.floor(i / 3) + 1;

    if (position === 0) {
      // Title row: only the description matters.
      if (isEmptyValue(row.descripcion)) {
        return invalid(
          `Grupo ${groupNumber}: el título del grupo no puede estar vacío.`,
        );
      }
      continue;
    }

    // Detail rows are validated only when the row exists.
    const rowLabel = DETAIL_ROW_LABELS[position - 1];
    for (const field of NUMERIC_FIELDS) {
      const error = validateNumericField(row, field, groupNumber, rowLabel);
      if (error) return invalid(error);
    }
  }

  return { ok: true };
}

/**
 * Normalizes a numeric input into a 2-decimal string for the API.
 * Throws a Spanish error when the value does not parse to a finite number.
 */
export function toDecimal2(value: unknown): string {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) {
    throw new Error(`El valor "${String(value)}" no es un número válido.`);
  }
  return parsed.toFixed(2);
}
