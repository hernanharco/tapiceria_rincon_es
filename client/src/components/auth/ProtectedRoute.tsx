'use client';

import { useAuth } from '@/context/AuthContext';
import { useEffect } from 'react';
import { hasPermission } from '@/lib/auth-utils';
import { Outlet } from 'react-router-dom';

export function ProtectedRoute({ children, minRole }) {
  const { user, isLoading } = useAuth();

  useEffect(() => {
    // Solo actuamos cuando el AuthContext ha terminado de consultar al backend
    if (!isLoading) {
      if (!user || !hasPermission(user.role, minRole)) {
        console.log("Acceso denegado. Redirigiendo a Auth Center...");
        window.location.href = 'http://localhost:9002/';
      }
    }
  }, [user, isLoading, minRole]);

  // Bloqueo visual: Mientras carga o si no tiene permiso, NO renderizamos los children
  if (isLoading || !user || !hasPermission(user.role, minRole)) {
    return (
      <div className="h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
          <p className="mt-4 text-gray-500">Verificando acceso...</p>
        </div>
      </div>
    );
  }

  // Si todo está correcto, mostramos la página de tapicería
  return children ? children : <Outlet />;
}