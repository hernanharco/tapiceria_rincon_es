
import { useState, useEffect } from 'react';
import { PDFViewer } from '@react-pdf/renderer';
import { DocumentTemplatePdf } from './DocumentTemplatePdf';
import { useParams } from 'react-router-dom';

// Hooks personalizados para obtener datos
import useCompany from '../company/hooks/useCompany';
import useClients from '../clients/hooks/useClients';
import useDocument from '../documents/hooks/useDocuments';
import useDataDocuments from '../documents/hooks/useDataDocuments';
import useFooters from '../documents/hooks/useFooters';
import usePagos from '../documents/hooks/usePagos';

export const PrintableViewPDF = () => {
  const { empresas } = useCompany();
  const { getClientByCif } = useClients();
  const { fetchDocumentByNum } = useDocument();
  const { getDocumentsByNum } = useDataDocuments();
  const { getFootersByFieldId } = useFooters();
  const { getPagosByClienteId } = usePagos();
  // 🎯 Recibimos el id desde la URL
  const { num_presupuesto, cif } = useParams();

  // Manejamos los estados del pdf a mostrar
  const [client, setClient] = useState(null)
  const [document, setDocument] = useState(null)
  const [footers, setFooters] = useState(null)
  const [cashPDF, setCashPDF] = useState(null)
  const [filteredProducts, setFilteredProducts] = useState([]);

  // Carga los datos de la Empresa
  const company = empresas?.[0];  

  /// Cargar cliente
  useEffect(() => {
    const fetchClient = async () => {
      if (!cif) return;
      try {
        const foundClient = await getClientByCif(cif);
        setClient(foundClient);
      } catch (err) {
        console.error("Error al cargar cliente:", err);
      }
    };
    fetchClient();
  }, [cif]);

  // Cargar documento
  useEffect(() => {
    const fetchDocument = async () => {
      if (!num_presupuesto) return;
      try {
        const foundDocument = await fetchDocumentByNum(num_presupuesto);
        setDocument(foundDocument);
      } catch (err) {
        console.error("Error al cargar documento:", err);
      }
    };
    fetchDocument();
  }, [num_presupuesto]);

  // Cargar productos del documento
  useEffect(() => {
    const loadProducts = async () => {
      // console.log("document.id", document[0].id)
      if (!document || !document.id) return;
      try {
        const results = await getDocumentsByNum(document.id);
        setFilteredProducts(results || []);
      } catch (err) {
        console.error("Error al cargar productos:", err);
      }
    };
    loadProducts();
  }, [document]);

  // Cargar footer
  useEffect(() => {
    const fetchFooter = async () => {
      if (!document || !document.id) return;
      try {
        const foundFooter = await getFootersByFieldId(document.id);
        setFooters(foundFooter || null);
      } catch (err) {
        console.error("Error al cargar footer:", err);
      }
    };
    fetchFooter();
  }, [document]);

  // Cargar pagos
  useEffect(() => {
    const fetchCash = async () => {
      if (!cif) return;
      try {
        const foundCash = await getPagosByClienteId(cif);
        setCashPDF(foundCash[0] || null);
      } catch (err) {
        console.error("Error al cargar pagos:", err);
      }
    };
    fetchCash();
  }, [cif]);

  // Comprobar si todos los datos están cargados
  useEffect(() => {
    const checkDataReady = () => {
      const isReady =
        company &&
        client &&
        document &&
        Array.isArray(filteredProducts) &&
        footers !== null &&
        cashPDF !== null;
    };

    checkDataReady();
  }, [company, client, document, filteredProducts, footers, cashPDF]);
  

  // console.log("company en PrintableViewPDF: ", company)
  // console.log("client en PrintableViewPDF: ", client)
  // console.log("document en PrintableViewPDF: ", document)
  // console.log("filteredProducts en PrintableViewPDF: ", filteredProducts)
  // console.log("footers en PrintableViewPDF: ", footers)
  // console.log("cashPDF en PrintableViewPDF: ", cashPDF)

  const isDataReady =
    company &&
    client &&
    document &&
    Array.isArray(filteredProducts) &&
    footers &&
    cashPDF;

  
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Generar PDF Presupuesto</h1>

      <div className="border rounded shadow-sm p-4 bg-gray-50 mb-6">
        {
          company && client && document && filteredProducts && footers && cashPDF ? (
            <PDFViewer style={{ width: '100%', height: '600px' }}>
              <DocumentTemplatePdf
                company={company}
                client={client}
                document={document}
                filteredProducts={filteredProducts}
                footers={footers}
                cashPDF={cashPDF}
              />
            </PDFViewer>
          ) : (
            <div>Cargando datos...</div>
          )
        }
      </div>
    </div>
  );
};