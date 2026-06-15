import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';

// Mock del context de auth
const mockLogin = vi.fn();
const mockNavigate = vi.fn();

vi.mock('@/context/AuthContext', () => ({
  useAuth: () => ({
    user: null,
    login: mockLogin,
  }),
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Import after mocks
import { LoginPage } from './LoginPage';

const renderLoginPage = () => {
  return render(
    <BrowserRouter>
      <LoginPage />
    </BrowserRouter>
  );
};

describe('LoginPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renderiza el formulario de login', () => {
    renderLoginPage();
    expect(screen.getByText('Tapicería Rincón')).toBeInTheDocument();
    expect(screen.getByText('Panel de Administración')).toBeInTheDocument();
    expect(screen.getByLabelText('Usuario')).toBeInTheDocument();
    expect(screen.getByLabelText('Contraseña')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /iniciar sesión/i })).toBeInTheDocument();
  });

  it('tiene los atributos de accesibilidad', () => {
    renderLoginPage();
    const usernameInput = screen.getByLabelText('Usuario');
    const passwordInput = screen.getByLabelText('Contraseña');

    expect(usernameInput).toHaveAttribute('aria-required', 'true');
    expect(passwordInput).toHaveAttribute('aria-required', 'true');
    expect(usernameInput).toHaveAttribute('autoComplete', 'username');
    expect(passwordInput).toHaveAttribute('autoComplete', 'current-password');
  });

  it('llama a login con usuario y contraseña', async () => {
    const user = userEvent.setup();
    mockLogin.mockResolvedValueOnce(true);
    renderLoginPage();

    await user.type(screen.getByLabelText('Usuario'), 'admin');
    await user.type(screen.getByLabelText('Contraseña'), 'admin123');
    await user.click(screen.getByRole('button', { name: /iniciar sesión/i }));

    expect(mockLogin).toHaveBeenCalledWith('admin', 'admin123');
  });

  it('muestra error si login falla', async () => {
    const user = userEvent.setup();
    mockLogin.mockResolvedValueOnce(false);
    renderLoginPage();

    await user.type(screen.getByLabelText('Usuario'), 'bad');
    await user.type(screen.getByLabelText('Contraseña'), 'bad');
    await user.click(screen.getByRole('button', { name: /iniciar sesión/i }));

    expect(await screen.findByRole('alert')).toHaveTextContent('Usuario o contraseña incorrectos');
  });

  it('deshabilita el botón mientras carga', async () => {
    const user = userEvent.setup();
    // Never resolves - keeps loading state
    mockLogin.mockImplementation(() => new Promise(() => {}));
    renderLoginPage();

    await user.type(screen.getByLabelText('Usuario'), 'admin');
    await user.type(screen.getByLabelText('Contraseña'), 'admin123');
    await user.click(screen.getByRole('button', { name: /iniciar sesión/i }));

    const button = screen.getByRole('button', { name: /entrando/i });
    expect(button).toBeDisabled();
  });
});
