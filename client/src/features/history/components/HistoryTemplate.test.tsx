import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';

const mockClients = [
  { id: 1, cif: '12345678A', name: 'María García' },
  { id: 2, cif: '87654321B', name: 'Juan Rodríguez' },
];
const mockDocuments = [
  { id: 1, titdescripcion: 'Tapizado sofá', titledoc: 1 },
];

vi.mock('../../../hooks/clients/useClients', () => ({
  default: () => ({ clients: mockClients }),
}));

vi.mock('../../documents/hooks/useTitleTableDocuments', () => ({
  default: () => ({ documents: mockDocuments, refetch: vi.fn() }),
}));

vi.mock('../../clients/components/modals/DocumentCreateModal', () => ({
  HistoryModals: ({ isOpen, onClose }) =>
    isOpen ? <div data-testid="modal-open">Modal abierto</div> : null,
}));

vi.mock('../hooks/HistoryModalLogic', () => ({
  HistoryModalLogic: () => ({}),
}));

vi.mock('../hooks/table/HistoryTableDocumentLogic', () => ({
  HistoryTableDocumentLogic: ({ documents, searchTerm, allClients }) => (
    <div data-testid="table-logic">
      <span data-testid="doc-count">{documents?.length || 0}</span>
      <span data-testid="search-term">{searchTerm}</span>
      <span data-testid="client-count">{allClients?.length || 0}</span>
    </div>
  ),
}));

import { HistoryTemplate } from './HistoryTemplate';

describe('HistoryTemplate', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  afterEach(() => {
    cleanup();
  });

  const renderTemplate = () => {
    // Asegurar localStorage limpio para cada test
    localStorage.clear();
    return render(
      <MemoryRouter>
        <HistoryTemplate />
      </MemoryRouter>
    );
  };

  it('renderiza el buscador de clientes', () => {
    renderTemplate();
    const input = screen.getByPlaceholderText(/buscar cliente/i);
    expect(input).toBeInTheDocument();
  });

  it('pasa los clientes al componente de tabla', () => {
    renderTemplate();
    expect(screen.getByTestId('client-count')).toHaveTextContent('2');
  });

  it('no pasa documentos filtrados inicialmente (sin búsqueda)', () => {
    renderTemplate();
    // Sin término de búsqueda, filteredText es []
    expect(screen.getByTestId('doc-count')).toHaveTextContent('0');
  });

  it('actualiza el término de búsqueda al escribir', async () => {
    const user = userEvent.setup();
    renderTemplate();

    const input = screen.getByPlaceholderText(/buscar cliente/i);
    await user.type(input, 'María');

    expect(screen.getByTestId('search-term')).toHaveTextContent('María');
  });

  it('sugiere clientes al hacer foco en el input sin texto', async () => {
    const user = userEvent.setup();
    renderTemplate();

    const input = screen.getByPlaceholderText(/buscar cliente/i);
    await user.click(input);

    // Sin texto, muestra los primeros 10 clientes
    expect(screen.getByText('María García')).toBeInTheDocument();
    expect(screen.getByText('Juan Rodríguez')).toBeInTheDocument();
  });

  it('filtra sugerencias mientras se escribe', async () => {
    const user = userEvent.setup();
    renderTemplate();

    const input = screen.getByPlaceholderText(/buscar cliente/i);
    await user.click(input);
    await user.type(input, 'Juan');

    // Debería mostrar a Juan y ocultar a María
    expect(screen.getByText('Juan Rodríguez')).toBeInTheDocument();
    expect(screen.queryByText('María García')).not.toBeInTheDocument();
  });

  it('selecciona un cliente del dropdown', async () => {
    const user = userEvent.setup();
    renderTemplate();

    const input = screen.getByPlaceholderText(/buscar cliente/i);
    await user.click(input);
    await user.click(screen.getByText('María García'));

    expect(screen.getByTestId('search-term')).toHaveTextContent(
      '(#1) María García'
    );
  });
});
