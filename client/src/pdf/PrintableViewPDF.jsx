import { useState, useEffect, useCallback } from 'react';
import { PDFViewer, PDFDownloadLink } from '@react-pdf/renderer';
import { useParams } from 'react-router-dom';

// Contextos
import { useApiCompanyContext } from '@/context/CompanyProvider'; // Asegúrate de que la ruta sea correcta
import { useApiClientsContext } from '@/context/ClientsProvider';
import { useApiDocumentsContext } from '@/context/DocumentsProvider';
import { useApiDataDocumentsContext } from '@/context/DataDocumentsProvider';
import { useApiFootersContext } from '@/context/FootersProvider';
import { useApiPagosContext } from '@/context/PagosProvider';
import { useApiTitleTableDocumentsContext } from '@/context/TitleTableDocumentsProvider';

// Componentes PDF e hijos
import { DocumentTemplatePdf } from '@/pdf/DocumentTemplatePdf';
import { HistoryModals } from '@/modules/history/HistoryModals';

export const PrintableViewPDF = () => {
  // 1. Usamos el contexto global de empresa
  const { empresas, loading: companyLoading } = useApiCompanyContext();

  const { getFilteredClients, clients } = useApiClientsContext();
  const { fetchDocumentByNum } = useApiDocumentsContext();
  const { getDocumentsByNum } = useApiDataDocumentsContext();
  const { getFootersByFieldId } = useApiFootersContext();
  const { pagos } = useApiPagosContext();
  const { fetchDocumentsByTitleDoc } = useApiTitleTableDocumentsContext();

  const { codigo, prinTitle, cif } = useParams();

  const [client, setClient] = useState(null);
  const [documentData, setDocumentData] = useState(null);
  const [footers, setFooters] = useState(null);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 2. Llave de refresco para forzar al PDFViewer a reiniciarse
  const [refreshKey, setRefreshKey] = useState(0);

  // Detectar si el usuario está en un dispositivo móvil
  const isMobile = window.innerWidth < 768;

  // 3. Preparar los datos de la empresa con Anti-Cache para el Logo
  const rawCompany = empresas?.[0];
  const company = rawCompany
    ? {
        ...rawCompany,
        // Añadimos timestamp a la URL del logo para forzar la recarga visual en el PDF
        logo: rawCompany.logo
          ? `${rawCompany.logo}?t=${new Date().getTime()}`
          : null,
      }
    : null;

  const cashPDF = pagos?.[0];

  // Forzar actualización cuando cambien los datos de la empresa en el contexto
  useEffect(() => {
    setRefreshKey((prev) => prev + 1);
  }, [empresas]);

  const loadAllData = useCallback(async () => {
    if (!codigo) return;
    try {
      const found = await fetchDocumentByNum(codigo);
      if (!found) return;

      setDocumentData(found);

      if (found?.id) {
        const foundFooter = getFootersByFieldId(found.id);
        setFooters(foundFooter);

        const [titleResponse, productsResponse] = await Promise.all([
          fetchDocumentsByTitleDoc(found.id),
          getDocumentsByNum(found.id),
        ]);

        const combinedData = titleResponse.flatMap((titleItem, i) => {
          const productGroup = productsResponse.slice(i * 2, (i + 1) * 2);
          if (productGroup.length === 0) return [];
          return [
            { ...titleItem, descripcion: titleItem.titdescripcion },
            ...productGroup,
          ];
        });

        setFilteredProducts(combinedData);
        // Actualizamos la llave al terminar de cargar productos
        setRefreshKey((prev) => prev + 1);
      }
    } catch (err) {
      console.error('Error cargando datos:', err);
    }
  }, [
    codigo,
    fetchDocumentByNum,
    getFootersByFieldId,
    fetchDocumentsByTitleDoc,
    getDocumentsByNum,
  ]);

  useEffect(() => {
    if (cif && clients.length > 0) {
      const found = getFilteredClients(cif);
      setClient(found.length > 0 ? found[0] : null);
    }
  }, [cif, clients, getFilteredClients]);

  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  const isDataReady = !!(
    company &&
    client &&
    documentData &&
    filteredProducts.length > 0 &&
    footers &&
    cashPDF
  );

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-[1400px] mx-auto">
        {/* Header Responsivo */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 bg-white p-6 rounded-2xl shadow-sm border border-gray-200 gap-4">
          <div className="text-center md:text-left">
            <h1 className="text-2xl font-black text-gray-800 tracking-tight">
              Visor de Documento
            </h1>
            <p className="text-blue-600 font-medium">
              {client?.name || 'Cargando...'} —{' '}
              <span className="text-gray-400">{codigo}</span>
            </p>
          </div>

          <div className="flex gap-3 w-full md:w-auto">
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex-1 md:flex-none px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              ✏️ Modificar
            </button>

            {isDataReady && (
              <PDFDownloadLink
                key={`download-${refreshKey}`} // Clave dinámica para refrescar el link de descarga
                document={
                  <DocumentTemplatePdf
                    prinTitle={prinTitle}
                    company={company}
                    client={client}
                    document={documentData}
                    filteredProducts={filteredProducts}
                    footers={footers}
                    cashPDF={cashPDF}
                  />
                }
                fileName={`${client.name}_${codigo}.pdf`}
                className="flex-1 md:flex-none px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                {({ loading }) => (loading ? 'Generando...' : '📥 Descargar')}
              </PDFDownloadLink>
            )}
          </div>
        </div>

        {/* Contenedor del Visor */}
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col">
          <div className="bg-gray-50 border-b px-6 py-3 flex items-center justify-between">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-400"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
              <div className="w-3 h-3 rounded-full bg-green-400"></div>
            </div>
            <span className="text-xs font-bold text-gray-400 tracking-widest uppercase">
              Vista Previa Oficial
            </span>
            <div className="w-12"></div>
          </div>

          <div className="p-2 bg-gray-200/50">
            {isDataReady ? (
              isMobile ? (
                <div className="h-[60vh] flex flex-col items-center justify-center bg-white rounded-xl p-6 text-center">
                  <div className="text-6xl mb-4">📄</div>
                  <h3 className="text-lg font-bold text-gray-800 mb-2">
                    Previsualización lista
                  </h3>
                  <p className="text-gray-500 mb-6 max-w-xs">
                    Los dispositivos móviles requieren descarga para visualizar
                    el documento.
                  </p>
                  <PDFDownloadLink
                    document={
                      <DocumentTemplatePdf
                        prinTitle={prinTitle}
                        company={company}
                        client={client}
                        document={documentData}
                        filteredProducts={filteredProducts}
                        footers={footers}
                        cashPDF={cashPDF}
                      />
                    }
                    fileName={`${client.name}_${codigo}.pdf`}
                    className="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold shadow-md"
                  >
                    {({ loading }) =>
                      loading ? 'Cargando...' : 'Ver Documento (PDF)'
                    }
                  </PDFDownloadLink>
                </div>
              ) : (
                <PDFViewer
                  key={refreshKey}
                  style={{
                    width: '100%',
                    height: '80vh',
                    borderRadius: '12px',
                    border: 'none',
                  }}
                >
                  <DocumentTemplatePdf
                    prinTitle={prinTitle}
                    company={company}
                    client={client}
                    document={documentData}
                    filteredProducts={filteredProducts}
                    footers={footers}
                    cashPDF={cashPDF}
                  />
                </PDFViewer>
              )
            ) : (
              <div className="h-[80vh] flex flex-col items-center justify-center bg-white rounded-xl">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                <p className="text-gray-500 font-bold italic">
                  Sincronizando datos maestros...
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {isModalOpen && (
        <HistoryModals
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            loadAllData();
          }}
          title={prinTitle}
          searchTerm={`(${client?.cif}) ${client?.name}`}
          selectedItem={documentData}
        />
      )}
    </div>
  );
};
