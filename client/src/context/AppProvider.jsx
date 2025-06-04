
// Importa tus proveedores individuales
import { CompanyProvider } from './CompanyProvider';
import { ClientsProvider } from './ClientsProvider';
import { DocumentsProvider } from './DocumentsProvider';
import { DataDocumentsProvider } from './DataDocumentsProvider';
import { FootersProvider } from './FootersProvider';
import { PagosProvider } from './PagosProvider';
import { HistoryProvider } from './HistoryProvider';

export const AppProvider = ({ children }) => {
    return (
        <CompanyProvider>
            <ClientsProvider>
                <DocumentsProvider>
                    <DataDocumentsProvider>
                        <FootersProvider>
                            <PagosProvider>
                                <HistoryProvider>
                                    {children}
                                </HistoryProvider>
                            </PagosProvider>
                        </FootersProvider>
                    </DataDocumentsProvider>
                </DocumentsProvider>
            </ClientsProvider>
        </CompanyProvider>
    );
};

