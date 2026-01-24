import { createContext, useContext, useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';

const AuthContext = createContext();

export function AuthProvider() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // 🛠️ CONFIGURACIÓN DEL INTERRUPTOR
  // Detecta si la seguridad está activa. Si no existe la variable, por defecto es 'true'.
  const isAuthEnabled = import.meta.env.VITE_ENABLE_AUTH !== 'false';

  const checkAuth = async () => {
    // Si la seguridad está desactivada, saltamos la llamada al servidor
    if (!isAuthEnabled) {
      console.warn("⚠️ SEGURIDAD DESACTIVADA: Usando modo desarrollo.");
      setUser({
        id: 0,
        name: "Arquitecto Senior (Dev)",
        role: "Admin",
        email: "dev@empresa.com"
      });
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:4000/api/perfil', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include' 
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Error crítico de autenticación:", error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  // Pantalla de carga profesional con Tailwind
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
    <AuthContext.Provider value={{ user, isLoading, checkAuth, isAuthEnabled }}>
      <Outlet />
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return context;
};