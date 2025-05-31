
// Importa tus proveedores individuales
import { CompanyProvider } from './CompanyProvider';
import { ClientsProvider } from './ClientsProvider';
import { DocumentsProvider } from './DocumentsProvider';
import { DataDocumentsProvider } from './DataDocumentsProvider';
import { FootersProvider } from './FootersProvider';
import { PagosProvider } from './PagosProvider';

export const AppProvider = ({ children }) => {
    return (
        <CompanyProvider>
            <ClientsProvider>
                <DocumentsProvider>
                    <DataDocumentsProvider>
                        <FootersProvider>
                            <PagosProvider>
                                {children}
                            </PagosProvider>
                        </FootersProvider>
                    </DataDocumentsProvider>
                </DocumentsProvider>
            </ClientsProvider>
        </CompanyProvider>
    );
};

