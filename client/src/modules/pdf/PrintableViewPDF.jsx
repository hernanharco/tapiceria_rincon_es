import { useState, useEffect } from "react";
import { PDFViewer } from "@react-pdf/renderer";
import { DocumentTemplatePdf } from "./DocumentTemplatePdf";
import { useParams } from "react-router-dom";

// Hooks personalizados para obtener datos
import useCompany from "../company/hooks/useCompany";
import useClients from "../clients/hooks/useClients";
import useDocument from "../documents/hooks/useDocuments";
import useDataDocuments from "../documents/hooks/useDataDocuments";
import useFooters from "../documents/hooks/useFooters";
import usePagos from "../documents/hooks/usePagos";
import useTitleTableDocuments from "../documents/hooks/useTitleTableDocuments";

export const PrintableViewPDF = () => {
  const { empresas } = useCompany();
  const { getClientByCif } = useClients();
  const { fetchDocumentByNum } = useDocument();
  const { getDocumentsByNum } = useDataDocuments();
  const { getFootersByFieldId } = useFooters();
  const { getPagosByClienteId } = usePagos();
  const { fetchDocumentsByTitleDoc } = useTitleTableDocuments();
  // 🎯 Recibimos el id desde la URL
  const { num_presupuesto, title, cif } = useParams();

  // Manejamos los estados del pdf a mostrar
  const [client, setClient] = useState(null);
  const [document, setDocument] = useState(null);
  const [footers, setFooters] = useState(null);
  const [cashPDF, setCashPDF] = useState(null);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [getAllDocumentsTitle, setGetAllDocumentsTitle] = useState([]);

  // Carga los datos de la Empresa
  const company = empresas?.[0];

  //El titulo del documento a imprimir
  const prinTitle = {
    num_presupuesto,
    title,
  };

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

  // // Cargar productos del documento
  // useEffect(() => {
  //   const loadProducts = async () => {
  //     // console.log("document.id", document[0].id)
  //     if (!document || !document.id) return;
  //     try {
  //       const results = await getDocumentsByNum(document.id);
  //       setFilteredProducts(results || []);
  //     } catch (err) {
  //       console.error("Error al cargar productos:", err);
  //     }
  //   };
  //   loadProducts();
  // }, [document]);

  // Cargar datos cuando sea edición
  useEffect(() => {
    const loadDocumentData = async () => {
      try {
        const [titleResponse, productsResponse] = await Promise.all([
          fetchDocumentsByTitleDoc(document.id),
          getDocumentsByNum(document.id),
        ]);

        // console.log("title", titleResponse);
        // console.log("products", productsResponse);

        // Combinar datos: 1 título + 3 productos, repetido
        const combinedData = [];

        for (let i = 0; i < titleResponse.length; i++) {
          // Convertir título en objeto con campo 'descripcion'
          const { titdescripcion, ...rest } = titleResponse[i];

          const titleItem = {
            ...rest,
            descripcion: titdescripcion,
          };

          // Tomar grupo de 2 productos consecutivos
          const productGroup = productsResponse.slice(i * 2, (i + 1) * 2);

          // Si no hay productos para este título, omitimos
          if (productGroup.length === 0) continue;

          // Añadimos el título + sus productos
          combinedData.push(titleItem, ...productGroup);
          // console.log("combinedData.push", combinedData);
        }

        // Actualizar estado
        setFilteredProducts(combinedData);
      } catch (error) {
        console.error("Error al cargar datos del documento:", error);
      }
    };

    loadDocumentData();
  }, [document]);

  // // Cargar Titulos de los productos del documento
  // useEffect(() => {
  //   const loadTitleProducts = async () => {
  //     // console.log("document.id-Title", document.id)
  //     if (!document || !document.id) return;
  //     try {
  //       const titleResponse = await fetchDocumentsByTitleDoc(document.id);

  //       for (let i = 0; i < titleResponse.length; i++) {
  //         // Convertir título en objeto con campo 'descripcion'
  //         const { titdescripcion, ...rest } = titleResponse[i];

  //         const titleItem = {
  //           ...rest,
  //           descripcion: titdescripcion,
  //         };

  //         // Tomar grupo de 2 productos consecutivos
  //         const productGroup = productsResponse.slice(i * 2, (i + 1) * 2);

  //         // Si no hay productos para este título, omitimos
  //         if (productGroup.length === 0) continue;

  //         // Añadimos el título + sus productos
  //         combinedData.push(titleItem, ...productGroup);
  //         // console.log("combinedData.push", combinedData);
  //       }

  //       // Actualizar estado
  //       setGetAllDocumentsTitle(combinedData);
  //     } catch (err) {
  //       console.error("Error al cargar productos:", err);
  //     }
  //   };
  //   loadTitleProducts();
  // }, [document]);

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
        cashPDF !== null &&
        Array.isArray(getAllDocumentsTitle);
    };

    checkDataReady();
  }, [company, client, document, filteredProducts, footers, cashPDF]);

  // console.log("company en PrintableViewPDF: ", company)
  // console.log("client en PrintableViewPDF: ", client)
  // console.log("document en PrintableViewPDF: ", document)
  // console.log("filteredProducts en PrintableViewPDF: ", filteredProducts)
  // console.log("footers en PrintableViewPDF: ", footers)
  // console.log("cashPDF en PrintableViewPDF: ", cashPDF)
  // console.log("getAllDocumentsTitle: ", getAllDocumentsTitle)

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

      <div className="border rounded shadow-sm p-4 bg-gray-50 mb-6 min-h-[600px] flex items-center justify-center">
        {company &&
        client &&
        document &&
        filteredProducts &&
        footers &&
        cashPDF ? (
          <PDFViewer
            style={{ width: "100%", height: "600px" }}
            className="w-full"
          >
            <DocumentTemplatePdf
              prinTitle={prinTitle}
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
        )}
      </div>
    </div>
  );
};
