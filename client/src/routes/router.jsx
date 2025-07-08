
import { createBrowserRouter } from 'react-router-dom';

// Componentes
import {Sidebar} from '../modules/sidebar/Sidebar';
import {AppProvider} from '../modules/context/AppProvider';

// Paginas
import {PrintableViewPDF} from '../modules/pdf/PrintableViewPDF';
import {HistoryDocumentsView} from '../pages/HistoryDocumentsView';
import {CreateClientView} from '../pages/CreateClientView';

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
        element: <HistoryDocumentsView />,
      },     
      {
        path: '/imprimir',
        element: <PrintableViewPDF />,
      },
      {
        path: '/imprimir/:num_presupuesto/:title/:cif',
        element: <PrintableViewPDF />,
      },
      {
        path: '/historial',
        element: <HistoryDocumentsView />,
      },
      {
        path: '/clientes',
        element: <CreateClientView />,
      },
    ],
  },
]);