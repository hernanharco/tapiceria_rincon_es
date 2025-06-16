
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
  const { getDocumentByNum } = useDocument();
  const { getDocumentsByNum } = useDataDocuments();
  const { getFootersByFieldId } = useFooters();
  const { getPagosByClienteId } = usePagos();
  // 🎯 Recibimos el id desde la URL
  const { numfactura, cif } = useParams();

  // Manejamos los estados del pdf a mostrar
  const [client, setClient] = useState(null)
  const [document, setDocument] = useState(null)
  const [footers, setFooters] = useState(null)
  const [cashPDF, setCashPDF] = useState(null)
  const [filteredProducts, setFilteredProducts] = useState([]);

  const company = empresas?.[0];

  // useEffect para cargar el cliente 
  useEffect(() => {
    const fetchClient = async () => {
      const foundClient = await getClientByCif(cif);
      setClient(foundClient);

      // if (foundClient) {
      //   console.log('Cliente encontrado:', foundClient);
      //   // Aquí puedes hacer lo que necesites con los datos del cliente
      // } else {
      //   console.log('Cliente no encontrado');
      // }
    };

    fetchClient();
  }, []); // Añade `cif` como dependencia si puede cambiar

  // use effect para cargar el documento
  useEffect(() => {
    const fetchDocument = async () => {
      const foundDocument = await getDocumentByNum(numfactura);
      setDocument(foundDocument);
    };

    fetchDocument();
  }, []); // añade `numfactura` como dependencia si puede cambiar

  // use effect para cargar los totales del footer del documento
  useEffect(() => {
    const fetchFooter = async () => {
      const foundFooter = await getFootersByFieldId(numfactura);
      // console.log('Datos del footer:', foundFooter[0]);
      setFooters(foundFooter[0] || null);
    };

    fetchFooter();
  }, []); // añade `numfactura` como dependencia si puede cambiar

  // use effect para cargar los Pagos segun la empresa
  useEffect(() => {
    const fetchCash = async () => {
      const foundCash = await getPagosByClienteId(cif);
      // console.log('Datos del foundCash:', foundCash[0]);
      setCashPDF(foundCash[0] || null);
    };

    fetchCash();
  }, []); // añade `numfactura` como dependencia si puede cambiar

  // useEffect(() => {
  //   console.log('💰 Estado cash actualizado:', cashPDF);
  // }, [cashPDF]);

  // Filtrar productos cada vez que cambie numDocument
  useEffect(() => {
    if (!document) return;

    if (!document.num_factura) {
      setFilteredProducts([]);
      return;
    }

    if (!isNaN(Number(document.num_factura))) {
      const index = parseInt(document.num_factura, 10);
      const results = getDocumentsByNum(index);
      setFilteredProducts(results || []);
    } else {
      setFilteredProducts([]);
    }
  }, [document]); // Añade `document` como dependencia

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