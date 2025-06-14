
import { createBrowserRouter } from 'react-router-dom';

// Componentes
import {Sidebar} from '../modules/sidebar/Sidebar';
import {AppProvider} from '../modules/context/AppProvider';

// Paginas
import {PrintableView} from '../pages/PrintableView';
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
        element: <PrintableView />,
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