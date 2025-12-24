import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import "dayjs/locale/es"; // Para manejar fechas en español
dayjs.locale("es");

import useDocuments from "@/modules/documents/hooks/useDocuments"; // Hook personalizado
import { HistoryTableDocumentView } from "./HistoryTableDocumentView"; // Componente de la tabla
import { HistoryModals } from "@/modules/history/HistoryModals"; // Modales para edición de documentos
import DateModal from "@/utils/dateModal"; // Modal para seleccionar fechas
import useHistoryTableDocument from "@/modules/history/hooks/useHistoryTableDocument";

export const HistoryTableDocumentLogic = ({
  setShowModal, // Función para abrir modal de nuevo documento
  documents, // Lista de documentos inicial
  searchTerm, // Valor del input de búsqueda
  allClients, // Lista de todos los clientes
}) => {
  const {
    getDocumentByDoc,
    getAllDocuments,
    refetch,
    fetchDocumentById,
    getDocumentsByObservaciones,
  } = useDocuments();

  const navigate = useNavigate();

  // Estados del componente
  const [showModalSearch, setShowModalSearch] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isDisabled, setIsDisabled] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [documentDate, setDocumentDate] = useState("");
  const [itemIdToCheck, setItemIdToCheck] = useState(null);
  const [opcItem, setOpcItem] = useState(null);

  const [sortConfig, setSortConfig] = useState({
    key: "num_presupuesto",
    direction: "desc",
  });

  // Memoizado para mostrar todos si searchTerm es "todos" o "%"
  const shouldShowAll = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return (
      term === "todos" || term === "%"
    );
  }, [searchTerm]);

  // Parsear searchTerm para separar CIF y nombre
  const parseSearchTerm = (value) => {
    const match = value.match(/^\(([^)]+)\)\s*(.*)/);
    return { cif: match ? match[1] : "", name: match ? match[2] : value };
  };
  const { cif } = parseSearchTerm(searchTerm);

  // Cargar documentos según searchTerm, CIF o lista inicial
  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        let filteredDocs = [];

        const search = searchTerm.trim().toLowerCase();

        // Determinar si searchTerm es de tipo observaciones
        const isObservacionesSearch =
          !shouldShowAll &&
          !cif &&
          documents?.some((doc) =>
            doc.titledoc.toLowerCase().includes(search)
          ) === false; // No coincide con productos

        if (shouldShowAll) {
          const allDocs = await getAllDocuments();
          filteredDocs = allDocs.map((doc) => {
            const client = allClients.find((c) => c.cif === doc.dataclient);
            return {
              ...doc,
              clienteNombre: client ? client.name : "Cliente desconocido",
            };
          });
        } else if (cif) {
          const docs = await getDocumentByDoc(String(cif).trim());
          filteredDocs = docs.map((doc) => {
            const client = allClients.find((c) => c.cif === doc.dataclient);
            return {
              ...doc,
              clienteNombre: client ? client.name : "Cliente desconocido",
            };
          });
        } else if (documents?.length && !isObservacionesSearch) {
          // Buscar por productos (titledoc)
          const promises = documents.map((doc) =>
            fetchDocumentById(String(doc.titledoc).trim())
          );
          const docs = await Promise.all(promises);
          filteredDocs = docs.filter(Boolean).map((doc) => {
            const client = allClients.find((c) => c.cif === doc.dataclient);
            return {
              ...doc,
              clienteNombre: client ? client.name : "Cliente desconocido",
            };
          });
        } else if (isObservacionesSearch) {
          // Buscar en observaciones
          const docsObs = await getDocumentsByObservaciones(search);
          filteredDocs = docsObs.map((doc) => {
            const client = allClients.find((c) => c.cif === doc.dataclient);
            return {
              ...doc,
              clienteNombre: client ? client.name : "Cliente desconocido",
            };
          });
        }

        filteredDocs.sort(
          (a, b) => new Date(b.fecha_factura) - new Date(a.fecha_factura)
        );

        setFilteredProducts(filteredDocs);
        setIsDisabled(!cif && !shouldShowAll);
      } catch (error) {
        console.error("Error al obtener documentos:", error);
        setFilteredProducts([]);
      }
    };

    fetchDocuments();
  }, [
    cif,
    searchTerm,
    shouldShowAll,
    allClients,
    refetch,
    documents,
    getAllDocuments,
    getDocumentByDoc,
    fetchDocumentById,
    getDocumentsByObservaciones,
  ]);

  // Función para ordenar por columna
  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc")
      direction = "desc";
    setSortConfig({ key, direction });
  };

  // Ordenar productos según sortConfig
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    const { key, direction } = sortConfig;
    let valueA = a[key];
    let valueB = b[key];

    if (typeof valueA === "string") {
      valueA = valueA.toLowerCase();
      valueB = valueB.toLowerCase();
    }
    if (key.includes("fecha") || key.includes("date")) {
      valueA = new Date(valueA);
      valueB = new Date(valueB);
    }

    if (valueA < valueB) return direction === "asc" ? -1 : 1;
    if (valueA > valueB) return direction === "asc" ? 1 : -1;
    return 0;
  });

  // Funciones para interacciones
  const handleUpdate = (item) => {
    setSelectedItem(item);
    setShowModalSearch(true);
  };

  const handlePrint = (item, title) => {
    navigate(`/imprimir/${item.num_presupuesto}/${title}/${cif}`);
  };

  //Funcion para el manejo de boton de seleccionar ALBARAN manejo de CheckList
  const [, setCompletedItems] = useState(new Set());
  const { toggleChecklistItemProvider, toggleChecklistItemFalse } =
    useHistoryTableDocument();

  const toggleChecklistItem = (itemId, opc) => {
    setItemIdToCheck(itemId);
    setOpcItem(opc);
    setIsModalOpen(true);
  };

  //Despues de abrir el modal y de seleccionar la fecha y darle guardar se activa esta funcion para generar la informacion siguiente
  const handleSaveDate = (date) => {
    // console.log("Fecha guardada:", date);
    setDocumentDate(date);

    if (itemIdToCheck && date) {
      const key = `${itemIdToCheck}-${opcItem}`; // clave única por item + tipo
      setCompletedItems((prev) => {
        const newSet = new Set(prev);
        if (newSet.has(key)) {
          newSet.delete(key);
          // console.log("Desmarcado:", key);
          toggleChecklistItemFalse(itemIdToCheck, opcItem);
        } else {
          newSet.add(key);
          // console.log("Marcado:", key);
          toggleChecklistItemProvider(itemIdToCheck, date, opcItem);
        }
        return newSet;
      });

      // resetear
      setItemIdToCheck(null);
      setOpcItem(null);
    }
  };

  return (
    <>
      <HistoryTableDocumentView
        sortedProducts={sortedProducts}
        setShowModal={setShowModal}
        isDisabled={isDisabled}
        handleUpdate={handleUpdate}
        handlePrint={handlePrint}
        toggleChecklistItem={toggleChecklistItem}
        requestSort={requestSort}
        sortConfig={sortConfig}
      />

      <HistoryModals
        isOpen={showModalSearch}
        onClose={() => setShowModalSearch(false)}
        selectedItem={selectedItem}
        searchTerm={searchTerm}
      />

      <DateModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveDate}
        initialDate={documentDate}
        itemId={itemIdToCheck}
        opcItem={opcItem}
      />
    </>
  );
};
