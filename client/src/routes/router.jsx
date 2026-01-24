import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { AppProvider } from '@/context/AppProvider';
import { Sidebar } from '@/features/sidebar/Sidebar';

// Páginas
import { HistoryDocumentsView } from '@/pages/HistoryDocumentsView';
import { CreateClientView } from '@/pages/CreateClientView';
import EnterpriseForm from '@/features/settings/components/EnterpriseForm';

export const router = createBrowserRouter([
  {
    // CAPA 0: Inicialización de sesión (Fetch /perfil)
    element: <AuthProvider />,
    children: [
      {
        // CAPA 1: Guardia de seguridad y Proveedores de Datos de Negocio
        element: (
          <ProtectedRoute minRole="Viewer">
            <AppProvider>
              <Sidebar />
            </AppProvider>
          </ProtectedRoute>
        ),
        // CAPA 2: Rutas de la aplicación (Hijas del Sidebar/Outlet)
        children: [
          {
            index: true,
            element: <HistoryDocumentsView />,
          },
          {
            path: '/historial',
            element: <HistoryDocumentsView />,
          },
          {
            path: '/clientes',
            element: <CreateClientView />,
          },
          {
            path: '/settings',
            element: <EnterpriseForm />,
          },          
        ],
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);