
// Importa tus proveedores individuales
import { CompanyProvider } from '../company/context/CompanyProvider';
import { ClientsProvider } from '../clients/context/ClientsProvider';
import { DocumentsProvider } from '../documents/context/DocumentsProvider';
import { DataDocumentsProvider } from '../documents/context/DataDocumentsProvider';
import { FootersProvider } from '../documents/context/FootersProvider';
import { PagosProvider } from '../documents/context/PagosProvider';
import { HistoryProvider } from '../history/context/HistoryProvider';

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

