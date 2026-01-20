import { createBrowserRouter } from 'react-router-dom';

// Componentes
import { Sidebar } from '../features/sidebar/Sidebar';
import { AppProvider } from '../context/AppProvider';

// Paginas
import { PrintableViewPDF } from '../-pdf/PrintableViewPDF';
import { HistoryDocumentsView } from '../pages/HistoryDocumentsView';
import { CreateClientView } from '../pages/CreateClientView';
import EnterpriseForm from '@/features/settings/components/EnterpriseForm';

export const router = createBrowserRouter([
  {
    element: (
      <AppProvider>
        <Sidebar />
      </AppProvider>
    ),
    children: [
      {
        index: true,
        element: <HistoryDocumentsView />, // Por esta parte tenemos el boton + agregar Nuevo Documento
      },
      // {
      //   path: '/imprimir',
      //   element: <PrintableViewPDF />,
      // },
      // {
      //   path: '/imprimir/:codigo/:prinTitle/:cif',
      //   element: <PrintableViewPDF />,
      // },
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
]);
