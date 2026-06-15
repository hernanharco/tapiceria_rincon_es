'use client';

import { useAuth } from '@/context/AuthContext';
import { Navigate, Outlet } from 'react-router-dom';
import { hasPermission } from '@/lib/auth-utils';

export function ProtectedRoute({ children, minRole }) {
  const { user, isLoading } = useAuth();

  // Mientras carga, mostramos spinner
  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
          <p className="mt-4 text-gray-500">Verificando acceso...</p>
        </div>
      </div>
    );
  }

  // No autenticado → redirect a login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Sin permisos suficientes → redirect a home
  if (!hasPermission(user.role, minRole)) {
    return <Navigate to="/" replace />;
  }

  // Todo ok → renderizar
  return children ? children : <Outlet />;
}
