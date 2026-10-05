import { describe, it, expect } from 'vitest';
import { getApiErrorMessage } from './apiErrorMessage';

const axiosLikeError = (data: unknown) => ({ response: { data } });

describe('getApiErrorMessage', () => {
  it('devuelve el cuerpo de error cuando es un string', () => {
    expect(
      getApiErrorMessage(axiosLikeError('Algo salió mal en el servidor.')),
    ).toBe('Algo salió mal en el servidor.');
  });

  it('devuelve el campo detail de DRF', () => {
    expect(getApiErrorMessage(axiosLikeError({ detail: 'No encontrado.' }))).toBe(
      'No encontrado.',
    );
  });

  it('formatea un error de campo de DRF en una línea legible', () => {
    expect(
      getApiErrorMessage(
        axiosLikeError({ cantidad: ['A valid number is required.'] }),
      ),
    ).toBe('cantidad: A valid number is required.');
  });

  it('une varios campos de error con punto y coma', () => {
    expect(
      getApiErrorMessage(
        axiosLikeError({
          cantidad: ['A valid number is required.'],
          precio: ['This field is required.'],
        }),
      ),
    ).toBe(
      'cantidad: A valid number is required.; precio: This field is required.',
    );
  });

  it('usa el fallback cuando no hay respuesta del servidor', () => {
    expect(getApiErrorMessage(new Error('boom'))).toBe('Error desconocido');
    expect(getApiErrorMessage(null)).toBe('Error desconocido');
  });

  it('respeta el fallback personalizado', () => {
    expect(getApiErrorMessage(undefined, 'Ups, algo falló')).toBe(
      'Ups, algo falló',
    );
  });

  it('usa el fallback con un cuerpo que no sigue el formato DRF', () => {
    expect(getApiErrorMessage(axiosLikeError({ foo: 'bar' }))).toBe(
      'Error desconocido',
    );
    expect(getApiErrorMessage(axiosLikeError({}))).toBe('Error desconocido');
    expect(getApiErrorMessage(axiosLikeError(['algo']))).toBe(
      'Error desconocido',
    );
    expect(getApiErrorMessage(axiosLikeError('   '))).toBe('Error desconocido');
  });
});
