import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, cleanup, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DateRangeFilter from './HistoryDateRangeFilter';

describe('DateRangeFilter', () => {
  const mockOnFilter = vi.fn();
  const mockOnClear = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  afterEach(() => {
    cleanup();
  });

  const renderFilter = (loading = false) => {
    return render(
      <DateRangeFilter
        onFilter={mockOnFilter}
        onClear={mockOnClear}
        loading={loading}
      />
    );
  };

  it('renderiza los botones de tipo de documento', () => {
    renderFilter();
    expect(screen.getByLabelText('Filtrar por Todos')).toBeInTheDocument();
    expect(screen.getByLabelText('Filtrar por Presupuesto')).toBeInTheDocument();
    expect(screen.getByLabelText('Filtrar por Albarán')).toBeInTheDocument();
    expect(screen.getByLabelText('Filtrar por Factura')).toBeInTheDocument();
  });

  it('renderiza los inputs de fecha', () => {
    renderFilter();
    expect(screen.getByLabelText('Fecha inicio')).toBeInTheDocument();
    expect(screen.getByLabelText('Fecha fin')).toBeInTheDocument();
  });

  it('no dispara filtro al montar el componente', () => {
    renderFilter();
    expect(mockOnFilter).not.toHaveBeenCalled();
    expect(mockOnClear).not.toHaveBeenCalled();
  });

  it('dispara onFilter al cambiar el tipo de documento', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    vi.useFakeTimers({ shouldAdvanceTime: true });
    renderFilter();

    await user.click(screen.getByLabelText('Filtrar por Presupuesto'));
    vi.advanceTimersByTime(500);

    await waitFor(() => {
      expect(mockOnFilter).toHaveBeenCalledWith('', '', 'Presupuesto');
    });
    vi.useRealTimers();
  });

  it('dispara onClear al seleccionar "Todos" después de un filtro', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    vi.useFakeTimers({ shouldAdvanceTime: true });
    renderFilter();

    await user.click(screen.getByLabelText('Filtrar por Presupuesto'));
    vi.advanceTimersByTime(500);
    await waitFor(() => expect(mockOnFilter).toHaveBeenCalledTimes(1));

    await user.click(screen.getByLabelText('Filtrar por Todos'));
    vi.advanceTimersByTime(500);
    await waitFor(() => expect(mockOnClear).toHaveBeenCalledTimes(1));

    vi.useRealTimers();
  });

  it('muestra el botón de limpiar solo cuando hay filtros activos', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    vi.useFakeTimers({ shouldAdvanceTime: true });
    renderFilter();

    expect(screen.queryByLabelText('Limpiar filtros')).not.toBeInTheDocument();

    await user.click(screen.getByLabelText('Filtrar por Factura'));
    vi.advanceTimersByTime(500);

    await waitFor(() => {
      expect(screen.getByLabelText('Limpiar filtros')).toBeInTheDocument();
    });
    vi.useRealTimers();
  });

  it('limpia los filtros al hacer clic en limpiar', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    vi.useFakeTimers({ shouldAdvanceTime: true });
    renderFilter();

    await user.click(screen.getByLabelText('Filtrar por Albarán'));
    vi.advanceTimersByTime(500);
    await waitFor(() => expect(mockOnFilter).toHaveBeenCalledTimes(1));

    await user.click(screen.getByLabelText('Limpiar filtros'));
    vi.advanceTimersByTime(500);
    await waitFor(() => expect(mockOnClear).toHaveBeenCalledTimes(1));

    vi.useRealTimers();
  });

  it('muestra indicador de carga cuando loading=true', () => {
    renderFilter(true);
    expect(screen.getByText('Actualizando resultados...')).toBeInTheDocument();
  });

  it('no muestra indicador de carga cuando loading=false', () => {
    renderFilter(false);
    expect(screen.queryByText('Actualizando resultados...')).not.toBeInTheDocument();
  });

  it('tiene los atributos de accesibilidad en los botones', () => {
    renderFilter();
    const todosBtn = screen.getByLabelText('Filtrar por Todos');
    expect(todosBtn).toHaveAttribute('aria-pressed', 'true');

    const presBtn = screen.getByLabelText('Filtrar por Presupuesto');
    expect(presBtn).toHaveAttribute('aria-pressed', 'false');
  });
});
