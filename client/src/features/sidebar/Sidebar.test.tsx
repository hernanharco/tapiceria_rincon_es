import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';

// Mocks
const mockUser = { id: 1, name: 'Admin', role: 'Admin' };
const mockCompany = { empresas: [{ name: 'Tapicería Rincón', cif: 'B12345678' }], loading: false };

vi.mock('@/context/AuthContext', () => ({
  useAuth: () => ({ user: mockUser, isLoading: false }),
}));

vi.mock('@/hooks/company/useCompany', () => ({
  default: () => mockCompany,
}));

vi.mock('@/constants/adminSidebar', () => ({
  MENU_ITEMS: [
    { label: 'Historial', path: '/historial', icon: 'FaHistory', activeColor: 'bg-blue-600' },
    { label: 'Clientes', path: '/clientes', icon: 'FaUsers', activeColor: 'bg-green-600' },
    { label: 'Ajustes', path: '/settings', icon: 'FaCog', activeColor: 'bg-purple-600' },
    { label: 'Panel Control', href: 'http://localhost:9002/admin', icon: 'FaExternalLinkAlt', activeColor: '' },
    { label: 'Web', href: 'http://localhost:9002', icon: 'FaGlobe', activeColor: '' },
  ],
}));

// Import after mocks
import { Sidebar } from './Sidebar';

const renderSidebar = (initialPath = '/') => {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <Sidebar />
    </MemoryRouter>
  );
};

describe('Sidebar', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renderiza el nombre de la empresa', () => {
    renderSidebar();
    expect(screen.getByText('Tapicería Rincón')).toBeInTheDocument();
  });

  it('renderiza los elementos del menú de navegación', () => {
    renderSidebar();
    expect(screen.getByText('Historial')).toBeInTheDocument();
    expect(screen.getByText('Clientes')).toBeInTheDocument();
    expect(screen.getByText('Ajustes')).toBeInTheDocument();
  });

  it('tiene el atributo aria-label en el aside', () => {
    renderSidebar();
    expect(screen.getByLabelText('Menú de navegación principal')).toBeInTheDocument();
  });

  it('tiene el botón de menú mobile con aria-label', () => {
    renderSidebar();
    const menuBtn = screen.getByLabelText('Abrir menú de navegación');
    expect(menuBtn).toBeInTheDocument();
    expect(menuBtn).toHaveAttribute('aria-expanded', 'false');
  });

  it('tiene el botón de colapso con aria-label en desktop', () => {
    renderSidebar();
    const collapseBtn = screen.getByLabelText('Contraer menú');
    expect(collapseBtn).toBeInTheDocument();
    expect(collapseBtn).toHaveAttribute('aria-controls', 'sidebar-menu');
  });

  it('renderiza enlaces de navegación internos', () => {
    renderSidebar();
    const historialLink = screen.getByText('Historial').closest('a');
    expect(historialLink).toHaveAttribute('href', '/historial');

    const clientesLink = screen.getByText('Clientes').closest('a');
    expect(clientesLink).toHaveAttribute('href', '/clientes');
  });

  it('destaca la ruta activa', () => {
    renderSidebar('/clientes');
    const clientesLink = screen.getByText('Clientes').closest('a');
    expect(clientesLink?.className).toContain('bg-green-600');
  });
});
