import { useState, useEffect, useCallback } from "react"; // Añadimos useCallback
import { PDFViewer, PDFDownloadLink } from "@react-pdf/renderer";
import { DocumentTemplatePdf } from "@/modules/pdf/DocumentTemplatePdf";
import { useParams } from "react-router-dom";
import { HistoryModals } from "@/modules/history/HistoryModals";

// Mantenemos tus contextos
import { useApiCompanyContext } from "@/modules/company/context/CompanyProvider";
import { useApiClientsContext } from "@/modules/clients/context/ClientsProvider";
import { useApiDocumentsContext } from "@/modules/documents/context/DocumentsProvider";
import { useApiDataDocumentsContext } from "@/modules/documents/context/DataDocumentsProvider";
import { useApiFootersContext } from "@/modules/documents/context/FootersProvider";
import { useApiPagosContext } from "@/modules/documents/context/PagosProvider";
import { useApiTitleTableDocumentsContext } from "@/modules/documents/context/TitleTableDocumentsProvider";

export const PrintableViewPDF = () => {
  const { empresas } = useApiCompanyContext();
  const { getFilteredClients, clients } = useApiClientsContext();
  const { fetchDocumentByNum } = useApiDocumentsContext();
  const { getDocumentsByNum } = useApiDataDocumentsContext();
  const { getFootersByFieldId } = useApiFootersContext(); // Asumimos que tienes un refetch o similar
  const { pagos } = useApiPagosContext();
  const { fetchDocumentsByTitleDoc } = useApiTitleTableDocumentsContext();

  const { num_presupuesto, title, cif } = useParams();

  const [client, setClient] = useState(null);
  const [document, setDocument] = useState(null);
  const [footers, setFooters] = useState(null);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 1. CLAVE DE REFRESCO: Para obligar al PDFViewer a reiniciarse
  const [refreshKey, setRefreshKey] = useState(0);

  const company = empresas?.[0];
  const cashPDF = pagos?.[0];
  const prinTitle = { num_presupuesto, title };

  // 2. FUNCIÓN DE CARGA CENTRALIZADA (Encapsula tu lógica original)
  const loadAllData = useCallback(async () => {
    if (!num_presupuesto) return;
    try {
      // Cargar cabecera del documento
      const found = await fetchDocumentByNum(num_presupuesto);
      setDocument(found);

      if (found?.id) {
        // Cargar Footer
        const foundFooter = getFootersByFieldId(found.id);
        setFooters(foundFooter);

        // Cargar Títulos y Productos
        const [titleResponse, productsResponse] = await Promise.all([
          fetchDocumentsByTitleDoc(found.id),
          getDocumentsByNum(found.id),
        ]);

        const combinedData = [];
        for (let i = 0; i < titleResponse.length; i++) {
          const { titdescripcion, ...rest } = titleResponse[i];
          const titleItem = { ...rest, descripcion: titdescripcion };
          const productGroup = productsResponse.slice(i * 2, (i + 1) * 2);
          if (productGroup.length > 0) {
            combinedData.push(titleItem, ...productGroup);
          }
        }
        setFilteredProducts(combinedData);
        
        // 3. Incrementamos la clave para que el PDFViewer se refresque visualmente
        setRefreshKey(prev => prev + 1);
      }
    } catch (err) {
      console.error("Error cargando datos:", err);
    }
  }, [num_presupuesto, fetchDocumentByNum, getFootersByFieldId, fetchDocumentsByTitleDoc, getDocumentsByNum]);

  // Efectos iniciales
  useEffect(() => {
    if (cif && clients.length > 0) {
      const found = getFilteredClients(cif);
      setClient(found.length > 0 ? found[0] : null);
    }
  }, [cif, clients, getFilteredClients]);

  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  const isDataReady = company && client && document && filteredProducts.length > 0 && footers && cashPDF;

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-[1400px] mx-auto">
        
        {/* ENCABEZADO (Tu estilo intacto) */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
          <div>
            <h1 className="text-2xl font-black text-gray-800 tracking-tight">Visor de Presupuesto</h1>
            <p className="text-blue-600 font-medium">{client?.name} — <span className="text-gray-400">{num_presupuesto}</span></p>
          </div>

          <div className="flex gap-3 mt-4 md:mt-0">
            <button 
              onClick={() => setIsModalOpen(true)}
              className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold shadow-lg transition-all active:scale-95 flex items-center gap-2"
            >
              <span>✏️</span> Modificar
            </button>

            {isDataReady && (
              <PDFDownloadLink
                key={`download-${refreshKey}`} // Usamos la key aquí también
                document={
                  <DocumentTemplatePdf
                    prinTitle={prinTitle} company={company} client={client}
                    document={document} filteredProducts={filteredProducts}
                    footers={footers} cashPDF={cashPDF}
                  />
                }
                fileName={`${client.name}_${num_presupuesto}.pdf`}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-lg transition-all active:scale-95 flex items-center gap-2"
              >
                <span>📥</span> Descargar
              </PDFDownloadLink>
            )}
          </div>
        </div>

        {/* CONTENEDOR PDF (Tu estilo intacto) */}
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col">
          <div className="bg-gray-50 border-b px-6 py-3 flex items-center justify-between">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-400"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
              <div className="w-3 h-3 rounded-full bg-green-400"></div>
            </div>
            <span className="text-xs font-bold text-gray-400 tracking-widest uppercase">Vista Previa Oficial</span>
            <div className="w-12"></div>
          </div>

          <div className="p-2 bg-gray-200/50">
            {isDataReady ? (
              <PDFViewer 
                key={refreshKey} // 4. CLAVE VITAL: Al cambiar, el PDF se recarga sin F5
                style={{ width: "100%", height: "80vh", borderRadius: "12px", border: "none" }}
              >
                <DocumentTemplatePdf
                  prinTitle={prinTitle} company={company} client={client}
                  document={document} filteredProducts={filteredProducts}
                  footers={footers} cashPDF={cashPDF}
                />
              </PDFViewer>
            ) : (
              <div className="h-[80vh] flex flex-col items-center justify-center bg-white rounded-xl">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                <p className="text-gray-500 font-bold italic">Actualizando vista...</p>
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
            // 5. EN LUGAR DE RELOAD, LLAMAMOS A LA FUNCIÓN DE CARGA
            loadAllData(); 
          }}
          title={title}
          searchTerm={`(${client?.cif}) ${client?.name}`}
          selectedItem={document}
        />
      )}
    </div>
  );
};