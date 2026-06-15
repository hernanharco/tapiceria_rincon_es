import { createContext, useContext, useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';

interface User {
  id: number;
  username: string;
  email: string;
  full_name: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthEnabled: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Helper: extraer datos del usuario de authCore
// Normalizar rol al formato esperado (ej: "ADMIN" → "Admin")
function normalizeRole(role: string): string {
  if (!role) return 'Viewer';
  return role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();
}

function mapUser(data: any): User {
  return {
    id: data.id || data.user_id,
    username: data.username || '',
    email: data.email || '',
    full_name: data.full_name || data.name || data.email || 'Usuario',
    role: normalizeRole(data.role || data.rol || 'VIEWER'),
  };
}

export function AuthProvider() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthEnabled = import.meta.env.VITE_ENABLE_AUTH !== 'false';
  const authURL = import.meta.env.VITE_AUTH_URL || 'http://localhost:8000';

  // Obtener perfil desde authCore
  const fetchProfile = async (): Promise<User | null> => {
    const token = localStorage.getItem('auth_token');
    if (!token) return null;

    try {
      const response = await fetch(`${authURL}/api/v1/users/me`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        return mapUser(data);
      } else {
        // Token inválido o expirado
        localStorage.removeItem('auth_token');
        return null;
      }
    } catch {
      localStorage.removeItem('auth_token');
      return null;
    }
  };

  // Login: llama a authCore y guarda el token
  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch(`${authURL}/api/v1/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) return false;

      const data = await response.json();
      localStorage.setItem('auth_token', data.access_token);

      const userData = await fetchProfile();
      if (userData) {
        setUser(userData);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  // Logout: limpia token y estado
  const logout = () => {
    localStorage.removeItem('auth_token');
    setUser(null);
  };

  // Carga inicial
  useEffect(() => {
    const init = async () => {
      if (!isAuthEnabled) {
        console.warn("⚠️ SEGURIDAD DESACTIVADA: Usando modo desarrollo.");
        setUser({
          id: 0,
          username: 'dev',
          email: 'dev@empresa.com',
          full_name: 'Arquitecto Senior (Dev)',
          role: 'ADMIN',
        });
        setIsLoading(false);
        return;
      }

      const userData = await fetchProfile();
      setUser(userData);
      setIsLoading(false);
    };
    init();
  }, []);

  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-slate-900">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-400 font-bold animate-pulse">
            {isAuthEnabled ? "Validando credenciales..." : "Iniciando modo desarrollo..."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, isAuthEnabled }}>
      <Outlet />
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return context;
};
