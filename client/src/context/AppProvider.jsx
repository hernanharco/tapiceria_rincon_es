// Importa tus proveedores individuales
import { CompanyProvider } from './CompanyProvider';
import { ClientsProvider } from './ClientsProvider';
import { DocumentsProvider } from './DocumentsProvider';
import { DataDocumentsProvider } from './DataDocumentsProvider';
import { FootersProvider } from './FootersProvider';
import { PagosProvider } from './PagosProvider';
import { HistoryProvider } from './HistoryProvider';
import { TitleTableDocumentsProvider } from './TitleTableDocumentsProvider';

export const AppProvider = ({ children }) => {
  return (
    <CompanyProvider>
      <ClientsProvider>
        <DocumentsProvider>
          <TitleTableDocumentsProvider>
            <DataDocumentsProvider>
              <FootersProvider>
                <PagosProvider>
                  <HistoryProvider>{children}</HistoryProvider>
                </PagosProvider>
              </FootersProvider>
            </DataDocumentsProvider>
          </TitleTableDocumentsProvider>
        </DocumentsProvider>
      </ClientsProvider>
    </CompanyProvider>
  );
};
