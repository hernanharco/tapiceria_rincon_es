import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import { AppProvider } from '@/context/AppProvider';
import { Sidebar } from '@/features/sidebar/Sidebar';

// Páginas
import { HistoryDocumentsView } from '@/pages/HistoryDocumentsView';
import { CreateClientView } from '@/pages/CreateClientView';
import EnterpriseForm from '@/features/settings/components/EnterpriseForm';

export const router = createBrowserRouter([
  {
    element: <AuthProvider />,
    children: [
      {
        element: (          
            <AppProvider>
              <Sidebar />
            </AppProvider>          
        ),
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
