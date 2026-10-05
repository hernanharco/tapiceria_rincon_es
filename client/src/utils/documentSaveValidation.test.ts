import { describe, it, expect } from 'vitest';
import { validateDocumentSave, toDecimal2 } from './documentSaveValidation';

// --- Helpers de construcción de payloads ---

const baseInput = (overrides: Record<string, unknown> = {}) => ({
  clientId: 1,
  date: '2025-06-01',
  docNumber: 'PRE123',
  rows: [] as Array<Record<string, unknown>>,
  ...overrides,
});

// Bloque de 3 filas: título, "Materiales" y "Mano de Obra"
const group = (
  titulo: string,
  mat: Record<string, unknown> = {},
  obra: Record<string, unknown> = {},
) => [
  { descripcion: titulo },
  {
    descripcion: 'Materiales',
    cantidad: '1',
    precio: '10',
    dto: '0',
    importe: '10',
    ...mat,
  },
  {
    descripcion: 'Mano de Obra',
    cantidad: '1',
    precio: '20',
    dto: '0',
    importe: '20',
    ...obra,
  },
];

const messageOf = (result: { ok: true } | { ok: false; message: string }) =>
  result.ok ? '' : result.message;

describe('validateDocumentSave', () => {
  it('acepta un payload válido con 1 grupo', () => {
    const result = validateDocumentSave(
      baseInput({ rows: group('Reparación de sofá') }),
    );
    expect(result).toEqual({ ok: true });
  });

  it('acepta un payload válido con 2 grupos', () => {
    const result = validateDocumentSave(
      baseInput({ rows: [...group('Grupo A'), ...group('Grupo B')] }),
    );
    expect(result).toEqual({ ok: true });
  });

  it('rechaza cuando no hay cliente seleccionado', () => {
    const result = validateDocumentSave(baseInput({ clientId: null }));
    expect(result.ok).toBe(false);
    expect(messageOf(result)).toContain('cliente');
  });

  it('rechaza la fecha vacía', () => {
    const result = validateDocumentSave(baseInput({ date: '' }));
    expect(result.ok).toBe(false);
    expect(messageOf(result)).toContain('Fecha Presupuesto');
  });

  it('rechaza una fecha con formato distinto de YYYY-MM-DD', () => {
    const result = validateDocumentSave(baseInput({ date: '01/06/2025' }));
    expect(result.ok).toBe(false);
    expect(messageOf(result)).toContain('Fecha Presupuesto');
  });

  it('rechaza el número de documento vacío', () => {
    const result = validateDocumentSave(baseInput({ docNumber: '   ' }));
    expect(result.ok).toBe(false);
    expect(messageOf(result)).toContain('número de Presupuesto');
  });

  it('rechaza un título de grupo vacío y numera el grupo', () => {
    const result = validateDocumentSave(baseInput({ rows: group('   ') }));
    expect(result.ok).toBe(false);
    expect(messageOf(result)).toContain('Grupo 1');
  });

  it('rechaza cantidad vacía en Materiales con mensaje específico', () => {
    const result = validateDocumentSave(
      baseInput({ rows: group('Reparación', { cantidad: '' }) }),
    );
    expect(result.ok).toBe(false);
    const message = messageOf(result);
    expect(message).toContain('Grupo 1 · Materiales');
    expect(message).toContain('"Cantidad"');
    expect(message).toContain('no puede quedar vacío');
  });

  it('rechaza un valor no numérico con coma decimal (1,5)', () => {
    const result = validateDocumentSave(
      baseInput({ rows: group('Reparación', { cantidad: '1,5' }) }),
    );
    expect(result.ok).toBe(false);
    expect(messageOf(result)).toContain('debe ser un número');
  });

  it('rechaza valores con más de 2 decimales', () => {
    const result = validateDocumentSave(
      baseInput({ rows: group('Reparación', { precio: '10.123' }) }),
    );
    expect(result.ok).toBe(false);
    const message = messageOf(result);
    expect(message).toContain('"Precio"');
    expect(message).toContain('2 decimales');
  });

  it('identifica grupo, fila y campo con error en el segundo grupo', () => {
    const result = validateDocumentSave(
      baseInput({
        rows: [...group('Grupo A'), ...group('Grupo B', {}, { importe: '' })],
      }),
    );
    expect(result.ok).toBe(false);
    const message = messageOf(result);
    expect(message).toContain('Grupo 2');
    expect(message).toContain('Mano de Obra');
    expect(message).toContain('"Importe"');
  });

  it('acepta un grupo con solo la fila de título (sin filas de detalle)', () => {
    const result = validateDocumentSave(
      baseInput({ rows: [{ descripcion: 'Solo título' }] }),
    );
    expect(result).toEqual({ ok: true });
  });

  it('acepta un número de documento numérico', () => {
    const result = validateDocumentSave(
      baseInput({ docNumber: 123, rows: [] }),
    );
    expect(result).toEqual({ ok: true });
  });

  it('rechaza un campo numérico con solo espacios en blanco', () => {
    const result = validateDocumentSave(
      baseInput({ rows: group('Reparación', { dto: '   ' }) }),
    );
    expect(result.ok).toBe(false);
    expect(messageOf(result)).toContain('"Dto %"');
    expect(messageOf(result)).toContain('no puede quedar vacío');
  });

  it('valida el bloque aunque la última fila de detalle falte', () => {
    const result = validateDocumentSave(
      baseInput({
        rows: [
          { descripcion: 'Grupo A' },
          { descripcion: 'Materiales', cantidad: '2', precio: '5', dto: '0', importe: '10' },
          { descripcion: 'Mano de Obra', cantidad: '1', precio: '20', dto: '0', importe: '20' },
          { descripcion: 'Grupo B' },
        ],
      }),
    );
    expect(result).toEqual({ ok: true });
  });
});

describe('toDecimal2', () => {
  it('convierte números y cadenas a string con 2 decimales', () => {
    expect(toDecimal2(2)).toBe('2.00');
    expect(toDecimal2('2')).toBe('2.00');
    expect(toDecimal2(1.5)).toBe('1.50');
    expect(toDecimal2('15.5')).toBe('15.50');
  });

  it('redondea a dos decimales', () => {
    expect(toDecimal2('1.239')).toBe('1.24');
    expect(toDecimal2('10.999')).toBe('11.00');
  });

  it('lanza un error en español con valores no numéricos', () => {
    expect(() => toDecimal2('1,5')).toThrow(/no es un número válido/);
    expect(() => toDecimal2(undefined)).toThrow(/no es un número válido/);
    expect(() => toDecimal2(NaN)).toThrow(/no es un número válido/);
  });
});
