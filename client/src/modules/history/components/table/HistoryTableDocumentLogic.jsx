import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import "dayjs/locale/es";
dayjs.locale("es");

// Hooks y Contextos
import useDocuments from "@/modules/documents/hooks/useDocuments"; 
import { useApiDataDocumentsContext } from "@/modules/documents/context/DataDocumentsProvider"; 
import { useApiTitleTableDocumentsContext } from "@/modules/documents/context/TitleTableDocumentsProvider"; 
import { useApiFootersContext } from "@/modules/documents/context/FootersProvider"; // Importado para el refetch
import { HistoryTableDocumentView } from "@/modules/history/components/table/HistoryTableDocumentView";
import { HistoryModals } from "@/modules/history/HistoryModals"; 
import DateModal from "@/utils/dateModal"; 
import useHistoryTableDocument from "@/modules/history/hooks/useHistoryTableDocument";

export const HistoryTableDocumentLogic = ({
  setShowModal, 
  documents: documentsFromProps, 
  searchTerm, 
  allClients, 
}) => {
  const navigate = useNavigate();
  
  // 1. Cabeceras
  const { 
    getDocumentByDoc, 
    documents: documentsFromContext, 
    fetchDocumentById,
    deleteProduct: deleteCabecera // Función para eliminar el documento padre
  } = useDocuments();
  
  // 2. Líneas (Materiales/Mano de obra)
  const { datadocuments, refetchdatadocuments } = useApiDataDocumentsContext();

  // 3. Títulos de bloque
  const { documents: titlesFromContext, refetch: refetchTitles } = useApiTitleTableDocumentsContext(); 

  // 4. Footer (Para refrescar estado)
  const { refetchclientes: refetchFooters } = useApiFootersContext();

  const [showModalSearch, setShowModalSearch] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isDisabled, setIsDisabled] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [itemIdToCheck, setItemIdToCheck] = useState(null);
  const [opcItem, setOpcItem] = useState(null);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);

  const [sortConfig, setSortConfig] = useState({
    key: "num_presupuesto",
    direction: "desc",
  });

  // --- NUEVA FUNCIÓN DE ELIMINACIÓN INTEGRAL (CASCADE) ---
  const handleFullDelete = async (item) => {
    const confirmacion = window.confirm(
      `¿Estás seguro de que deseas eliminar COMPLETAMENTE el presupuesto ${item.num_presupuesto}?\n\n` +
      `Se borrarán automáticamente todas las líneas, títulos y totales asociados.`
    );

    if (confirmacion) {
      try {
        // Al borrar el Documento, Django (por el models.CASCADE) borra 
        // DataDocument, titleDescripcion y FooterDocument automáticamente.
        await deleteCabecera(item.id);
        
        // Refrescamos los contextos para que la UI se actualice
        if(refetchdatadocuments) refetchdatadocuments(true);
        if(refetchTitles) refetchTitles(true);
        if(refetchFooters) refetchFooters(true);

        alert("Documento eliminado correctamente.");
      } catch (error) {
        console.error("Error al eliminar el documento:", error);
        alert("Hubo un error al intentar eliminar el documento.");
      }
    }
  };

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearchTerm(searchTerm), 300);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const shouldShowAll = useMemo(() => {
    const term = debouncedSearchTerm?.trim().toLowerCase();
    return term === "todos" || term === "%";
  }, [debouncedSearchTerm]);

  const parseSearchTerm = (value) => {
    const match = value.match(/^\(([^)]+)\)\s*(.*)/);
    return { cif: match ? match[1] : "" };
  };
  const { cif } = parseSearchTerm(debouncedSearchTerm);

  // --- EFECTO DE BÚSQUEDA CRUZADA (3 TABLAS) ---
  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        let baseDocs = [];
        const search = debouncedSearchTerm.trim().toLowerCase();

        // Determinar base inicial de documentos
        if (shouldShowAll) {
          baseDocs = documentsFromContext || [];
        } else if (cif) {
          baseDocs = await getDocumentByDoc(String(cif).trim());
        } else if (documentsFromProps && documentsFromProps.length > 0) {
          const titledocsIds = documentsFromProps.map((doc) => doc.titledoc);
          const promises = titledocsIds.map((id) => fetchDocumentById(id));
          const results = await Promise.all(promises);
          baseDocs = results.filter((doc) => doc !== null);
        } else {
          baseDocs = documentsFromContext || [];
        }

        // --- ENRIQUECIMIENTO ---
        const enrichedDocs = baseDocs.map(doc => ({
          ...doc,
          lineas: datadocuments?.filter(l => l.documento === doc.id) || [],
          titulos: titlesFromContext?.filter(t => t.titledoc === doc.id) || []
        }));

        let result = enrichedDocs;

        // --- FILTRADO MULTICAMPO ---
        if (search.length > 0 && !shouldShowAll && !cif) {
          result = enrichedDocs.filter((doc) => {
            const inHeader = (
              doc.num_presupuesto?.toString().includes(search) ||
              doc.observaciones?.toLowerCase().includes(search)
            );
            const inLines = doc.lineas.some(l => 
              l.descripcion?.toLowerCase().includes(search) || 
              l.referencia?.toLowerCase().includes(search)
            );
            const inTitles = doc.titulos.some(t => 
              t.titdescripcion?.toLowerCase().includes(search)
            );
            return inHeader || inLines || inTitles;
          });
        }

        // Mapeo de clientes para la vista
        const finalDocs = result.map((doc) => {
          const client = allClients.find((c) => c.cif === doc.dataclient);
          return {
            ...doc,
            clienteNombre: client ? client.name : "Cliente desconocido",
          };
        });

        finalDocs.sort((a, b) => new Date(b.fecha_factura) - new Date(a.fecha_factura));
        setFilteredProducts(finalDocs);
        setIsDisabled(!cif && !shouldShowAll);

      } catch (error) {
        console.error("Error en búsqueda HistoryTable:", error);
        setFilteredProducts([]);
      }
    };

    fetchDocuments();
  }, [debouncedSearchTerm, cif, shouldShowAll, documentsFromProps, documentsFromContext, datadocuments, titlesFromContext, allClients]);

  // Ordenación de columnas
  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") direction = "desc";
    setSortConfig({ key, direction });
  };

  const sortedProducts = useMemo(() => {
    return [...filteredProducts].sort((a, b) => {
      let vA = a[sortConfig.key] ?? "";
      let vB = b[sortConfig.key] ?? "";
      if (typeof vA === "string") { vA = vA.toLowerCase(); vB = vB.toLowerCase(); }
      if (vA < vB) return sortConfig.direction === "asc" ? -1 : 1;
      if (vA > vB) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredProducts, sortConfig]);

  const handleUpdate = (item) => { setSelectedItem(item); setShowModalSearch(true); };
  const handlePrint = (item, title) => navigate(`/imprimir/${item.num_presupuesto}/${title}/${item.dataclient}`);
  const { toggleChecklistItemProvider } = useHistoryTableDocument();

  return (
    <>
      <HistoryTableDocumentView
        sortedProducts={sortedProducts}
        setShowModal={setShowModal}
        isDisabled={isDisabled}
        handleUpdate={handleUpdate}
        handlePrint={handlePrint}
        handleDeleteFactura={handleFullDelete} // Usamos la nueva función aquí
        toggleChecklistItem={(id, opc) => { setItemIdToCheck(id); setOpcItem(opc); setIsModalOpen(true); }}
        requestSort={requestSort}
        sortConfig={sortConfig}
        onDoubleClickSearch={(e) => e.target.select()}
      />

      <HistoryModals isOpen={showModalSearch} onClose={() => setShowModalSearch(false)} selectedItem={selectedItem} searchTerm={searchTerm} />
      
      <DateModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={async (date) => {
          if (itemIdToCheck && date) {
            await toggleChecklistItemProvider(itemIdToCheck, date, opcItem);
            setIsModalOpen(false);
          }
        }}
        itemId={itemIdToCheck}
        opcItem={opcItem}
      />
    </>
  );
};