import { describe, it, expect } from 'vitest';
import { classifyDuplicateHeader } from './duplicateHeader';

const doc = (overrides: Record<string, unknown> = {}) => ({
  id: 10,
  num_presupuesto: 'PRE123',
  dataclient: 5,
  ...overrides,
});

describe('classifyDuplicateHeader', () => {
  it('aborta cuando no se pudo recuperar el documento existente (null)', () => {
    const result = classifyDuplicateHeader({
      existing: null,
      clientId: 5,
      hasFooter: false,
    });
    expect(result.action).toBe('abort');
    if (result.action === 'abort') {
      expect(result.message).toContain('No se pudo recuperar el documento existente');
    }
  });

  it('aborta cuando el documento recuperado no tiene id', () => {
    const result = classifyDuplicateHeader({
      existing: { num_presupuesto: 'PRE123', dataclient: 5 } as never,
      clientId: 5,
      hasFooter: false,
    });
    expect(result.action).toBe('abort');
    if (result.action === 'abort') {
      expect(result.message).toContain('No se pudo recuperar el documento existente');
    }
  });

  it('aborta cuando el número ya pertenece a otro cliente', () => {
    const result = classifyDuplicateHeader({
      existing: doc({ dataclient: 7 }),
      clientId: 5,
      hasFooter: false,
    });
    expect(result.action).toBe('abort');
    if (result.action === 'abort') {
      expect(result.message).toContain('PRE123');
      expect(result.message).toContain('pertenece a otro cliente');
    }
  });

  it('compara cliente y id con igualdad laxa (string vs number)', () => {
    const result = classifyDuplicateHeader({
      existing: doc({ dataclient: '5' }),
      clientId: 5,
      hasFooter: false,
    });
    expect(result).toEqual({ action: 'reuse' });
  });

  it('reutiliza cuando es del mismo cliente y no tiene footer (artefacto parcial)', () => {
    const result = classifyDuplicateHeader({
      existing: doc(),
      clientId: 5,
      hasFooter: false,
    });
    expect(result).toEqual({ action: 'reuse' });
  });

  it('reutiliza aunque clientId llegue como string y el documento como number', () => {
    const result = classifyDuplicateHeader({
      existing: doc({ dataclient: 5 }),
      clientId: '5',
      hasFooter: false,
    });
    expect(result).toEqual({ action: 'reuse' });
  });

  it('aborta cuando es del mismo cliente y el documento ya tiene footer', () => {
    const result = classifyDuplicateHeader({
      existing: doc(),
      clientId: 5,
      hasFooter: true,
    });
    expect(result.action).toBe('abort');
    if (result.action === 'abort') {
      expect(result.message).toContain('PRE123');
      expect(result.message).toContain('ya pertenece a un documento guardado');
      expect(result.message).toContain('otro número');
    }
  });

  it('aborta por cliente distinto aunque no tenga footer', () => {
    const result = classifyDuplicateHeader({
      existing: doc({ dataclient: 9 }),
      clientId: '5',
      hasFooter: false,
    });
    expect(result.action).toBe('abort');
    if (result.action === 'abort') {
      expect(result.message).toContain('pertenece a otro cliente');
    }
  });
});
