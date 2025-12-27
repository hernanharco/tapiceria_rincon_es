// Esta clase se encarga de dibujar la tabla que se muestra en la parte de abajo según el cliente buscado
import { useState, useEffect, useMemo } from "react";
import {
  FaEdit,
  FaTrashAlt,
  FaPrint,
  FaSort,
  FaSortUp,
  FaSortDown,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

// Se utiliza para darle formato a la fecha
import dayjs from "dayjs";
import "dayjs/locale/es";
dayjs.locale("es"); // Configura el idioma por defecto de la fecha

// Importamos los hooks necesarios
import useHistory from "./hooks/useHistory";
import useDocuments from "../documents/hooks/useDocuments"; // Asegúrate de que la ruta es correcta
import useHistoryTableDocument from "./hooks/useHistoryTableDocument";
// Importamos el componente de búsqueda
import { HistoryModals } from "./HistoryModals";
import DateModal from "../../utils/dateModal";

export const HistoryTableDocument = ({
  setShowModal,
  documents,
  searchTerm,
  allClients,
}) => {
  // 👇 Aquí imprimimos los props recibidos
  // console.log({
  //   setShowModal,
  //   documents,
  //   searchTerm,
  //   allClients,
  // });

  const { toggleChecklistItemProvider, toggleChecklistItemFalse } =
    useHistoryTableDocument();
  const {
    getDocumentByDoc,
    deleteProduct,
    getAllDocuments,
    refetch,
    fetchDocumentById,
  } = useDocuments();

  const [showModalSearch, setShowModalSearch] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isDisabled, setIsDisabled] = useState(true); // Deshabilitado al inicio

  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpenFact, setIsModalOpenFact] = useState(false);
  const [documentDate, setDocumentDate] = useState("");

  //Todos los clientes
  const shouldShowAll = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return term === "todos" || term === "%";
  }, [searchTerm]);

  //Para mostrar aquellos clientes que tenga un producto relacionado con lo que se escribio en el buscador

  // Función para extraer CIF y nombre
  const parseSearchTerm = (value) => {
    const match = value.match(/^\(([^)]+)\)\s*(.*)/);
    return {
      cif: match ? match[1] : "",
      name: match ? match[2] : value,
    };
  };

  const { cif, name } = parseSearchTerm(searchTerm); // Desestructuramos los valores

  // Filtrar productos cada vez que cambie numDocument
  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        let filteredDocs = [];

        if (shouldShowAll) {
          // ✅ Caso especial: mostrar todos los documentos de todos los clientes
          const allDocs = await getAllDocuments();
          // Opcional: enriquecer con nombre del cliente
          filteredDocs = allDocs.map((doc) => {
            const client = allClients.find((c) => c.cif === doc.dataclient);
            return {
              ...doc,
              clienteNombre: client ? client.name : "Cliente desconocido",
            };
          });
        } else if (cif) {
          // ✅ Caso normal: filtrar por CIF
          filteredDocs = await getDocumentByDoc(String(cif).trim());
        } else if (documents && documents.length > 0) {
          // ✅ Caso Especial: Filtramos cualquier letra relacionada con algun producto
          const titledocs = documents.map((doc) => doc.titledoc);
          // console.log("Buscando por titledocs:", titledocs);

          // Hacemos una llamada por cada titledoc
          const promises = titledocs.map((id) =>
            fetchDocumentById(String(id).trim())
          );

          // Esperamos todas las respuestas
          const docs = await Promise.all(promises);

          // Filtramos solo los documentos válidos (no null)
          filteredDocs = docs.filter((doc) => doc !== null);

          // console.log("Documentos obtenidos:", filteredDocs);
        } else {
          // ✅ Sin búsqueda: no mostrar nada (o podrías mostrar todos si prefieres)
          filteredDocs = [];
        }

        const sortedDocs = sortDocumentsByDate(filteredDocs || []);
        setFilteredProducts(sortedDocs);
        setIsDisabled(!cif && !shouldShowAll); // Habilitar botón si hay CIF o si se muestra todo
      } catch (error) {
        console.error("Error al obtener documentos:", error);
        setFilteredProducts([]);
      }
    };

    fetchDocuments();
  }, [cif, searchTerm, shouldShowAll, allClients, refetch]);

  // Función para ordenar
  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  // Ordena los productos según el estado actual
  // Estado para ordenamiento
  const [sortConfig, setSortConfig] = useState({
    key: "num_presupuesto",
    direction: "desc",
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (!sortConfig.key) return 0;
    const { key, direction } = sortConfig;
    let valueA = a[key];
    let valueB = b[key];

    // Si es texto, lo pasamos a minúsculas para comparación correcta
    if (typeof valueA === "string") {
      valueA = valueA.toLowerCase();
      valueB = valueB.toLowerCase();
    }

    // Si es fecha, convertimos a Date
    if (key === "fecha_factura") {
      valueA = new Date(valueA);
      valueB = new Date(valueB);
    }

    if (valueA < valueB) return direction === "asc" ? -1 : 1;
    if (valueA > valueB) return direction === "asc" ? 1 : -1;
    return 0;
  });

  // Para actualizar la información
  const handleUpdate = (item) => {
    setSelectedItem(item);
    setShowModalSearch(true);
  };

  const handleDelete = async (item) => {
    console.log("Eliminar documento:", item);
    if (
      window.confirm(
        `¿Estás seguro de eliminar el registro con número: ${item.num_presupuesto}?`
      )
    ) {
      try {
        await deleteProduct(item.id); // Elimina del backend
        const filteredDocs = await getAllDocuments();
        setFilteredProducts(filteredDocs || []);
        alert("Documento eliminado correctamente");
      } catch (error) {
        console.error("Error al eliminar el documento:", error);
        if (error.response) {
          alert(
            `Error del servidor: ${error.response.status} - ${
              error.response.data.message || "No se pudo eliminar"
            }`
          );
        } else if (error.request) {
          alert("No se recibió respuesta del servidor.");
        } else {
          alert(`Ocurrió un error: ${error.message}`);
        }
      }
    }
  };

  const handlePrint = (item, title) => {
    navigate(`/imprimir/${item.num_presupuesto}/${title}/${cif}`);
  };

  const sortDocumentsByDate = (documents) => {
    return documents.sort((a, b) => {
      const dateA = new Date(a.fecha_factura);
      const dateB = new Date(b.fecha_factura);
      if (dateA > dateB) return -1; // Más reciente primero
      if (dateA < dateB) return 1;
      return 0;
    });
  };

  //Funcion para el manejo de boton de seleccionar ALBARAN manejo de CheckList
  const [completedItems, setCompletedItems] = useState(new Set());
  const [itemIdToCheck, setItemIdToCheck] = useState(null);
  const [opcItem, setOpcItem] = useState();

  const toggleChecklistItem = (itemId, opc) => {
    setItemIdToCheck(itemId); // Guardamos el itemId
    setIsModalOpen(true); // Abrimos el modal
    setOpcItem(opc);
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
    <div>
      {/* Tabla de documentos (visible en escritorio) */}
      <div className="hidden md:block overflow-x-auto rounded-lg border border-gray-200 shadow-md">
        <table className="min-w-full bg-white divide-y divide-gray-200">
          {/* Títulos de la tabla */}
          <thead className="bg-gray-100">
            <tr>
              <th
                scope="col"
                className="px-6 py-4 text-center text-sm font-semibold text-gray-700 uppercase tracking-wider cursor-pointer"
                onClick={() => requestSort("num_presupuesto")}
              >
                <div className="flex items-center justify-center space-x-1">
                  <span>Presupuesto</span>
                  {sortConfig.key === "num_presupuesto" ? (
                    sortConfig.direction === "asc" ? (
                      <FaSortUp />
                    ) : (
                      <FaSortDown />
                    )
                  ) : (
                    <FaSort />
                  )}
                </div>
              </th>
              <th
                scope="col"
                className="px-6 py-4 text-center text-sm font-semibold text-gray-700 uppercase tracking-wider cursor-pointer"
                onClick={() => requestSort("num_albaran")}
              >
                <div className="flex items-center justify-center space-x-1">
                  <span>Albarán</span>
                  {sortConfig.key === "num_albaran" ? (
                    sortConfig.direction === "asc" ? (
                      <FaSortUp />
                    ) : (
                      <FaSortDown />
                    )
                  ) : (
                    <FaSort />
                  )}
                </div>
              </th>
              <th
                scope="col"
                className="px-6 py-4 text-center text-sm font-semibold text-gray-700 uppercase tracking-wider cursor-pointer"
                onClick={() => requestSort("num_factura")}
              >
                <div className="flex items-center justify-center space-x-1">
                  <span>Factura</span>
                  {sortConfig.key === "num_factura" ? (
                    sortConfig.direction === "asc" ? (
                      <FaSortUp />
                    ) : (
                      <FaSortDown />
                    )
                  ) : (
                    <FaSort />
                  )}
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            <tr key="add-button-row">
              <td colSpan="5" className="px-6 py-4 text-center">
                <button
                  onClick={() => setShowModal(true)}
                  disabled={isDisabled}
                  className={`inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white transition-colors duration-200 
                                    ${
                                      isDisabled
                                        ? "bg-gray-400 cursor-not-allowed"
                                        : "bg-green-600 hover:bg-green-700 focus:ring-green-500"
                                    } focus:outline-none focus:ring-2 focus:ring-offset-2`}
                  aria-label="Agregar nuevo documento"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5 mr-2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 4.5v15m7.5-7.5h-15"
                    />
                  </svg>
                  Agregar Nuevo Documento
                </button>
              </td>
            </tr>
            {/*Finaliza el boton Agregar Nuevo Documento*/}
            {sortedProducts.length === 0 ? (
              <tr>
                <td
                  colSpan="5"
                  className="py-6 text-center text-gray-500 italic"
                >
                  No hay documentos registrados.
                </td>
              </tr>
            ) : (
              sortedProducts.map((item, idx) => (
                <tr
                  key={idx}
                  className="hover:bg-gray-50 transition-colors duration-150"
                >
                  {/* Accion para el imprimir presupuesto */}
                  <td
                    onClick={() => handlePrint(item)}
                    className="cursor-pointer px-6 py-4 text-center align-top text-sm group"
                  >
                    {/* Título del documento */}
                    <div className="font-semibold text-gray-800">
                      {item.num_presupuesto ? item.num_presupuesto : "-"}
                    </div>

                    {/* Fecha del documento opcionalmente */}
                    <div className="text-xs text-gray-500 mt-1">
                      {item.fecha_factura
                        ? dayjs(item.fecha_factura).format(
                            "dddd, D [de] MMMM [de] YYYY"
                          )
                        : dayjs().format("dddd, D [de] MMMM [de] YYYY")}
                    </div>

                    {/* Botones debajo del título */}
                    <div className="mt-2 flex justify-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      {/* Botón Actualizar */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation(); // Evita que se dispare el onClick del td
                          handleUpdate(item);
                        }}
                        className="inline-flex items-center justify-center w-8 h-8 rounded bg-blue-600 hover:bg-blue-700 text-white transition-all duration-200 focus:outline-none shadow-md"
                        title="Actualizar"
                      >
                        <FaEdit size={12} />
                        <span className="sr-only">Actualizar</span>
                      </button>

                      {/* Botón Checklist */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation(); // Evita que se dispare el onClick del td
                          toggleChecklistItem(item.id, "1");
                        }}
                        disabled={!!item.num_albaran}
                        className={`inline-flex items-center justify-center w-8 h-8 rounded transition-all duration-200 focus:outline-none shadow-md ${
                          !!item.num_albaran
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-yellow-500 hover:bg-yellow-600"
                        }`}
                        title="Marcar como completado"
                      >
                        <input
                          type="checkbox"
                          disabled={!!item.num_albaran}
                          checked={!!item.num_albaran}
                          onChange={() => {}}
                          className="form-checkbox h-3 w-3 text-yellow-600 rounded mr-0 focus:ring-yellow-500"
                        />
                      </button>
                    </div>
                  </td>

                  {/* Accion para imprimir Albaran */}
                  <td
                    onClick={() => handlePrint(item, "ALBARAN")}
                    className="cursor-pointer px-6 py-4 text-center align-top text-sm group"
                  >
                    {/* Título del documento */}
                    <div className="font-semibold text-gray-800">
                      {item.num_albaran ? item.num_albaran : "-"}
                    </div>

                    {/* Fecha del documento opcionalmente */}
                    <div className="text-xs text-gray-500 mt-1">
                      {item.fecha_factalb
                        ? dayjs(item.fecha_factalb).format(
                            "dddd, D [de] MMMM [de] YYYY"
                          )
                        : ""}
                    </div>

                    {/* Botones debajo del título */}
                    <div className="mt-2 flex justify-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      {/* Botón Checklist */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation(); // Evita que se dispare el onClick del td
                          toggleChecklistItem(item.id, "2");
                        }}
                        disabled={!!item.num_factura}
                        className={`inline-flex items-center justify-center w-8 h-8 rounded transition-all duration-200 focus:outline-none shadow-md ${
                          !!item.num_factura
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-yellow-500 hover:bg-yellow-600"
                        }`}
                        title="Marcar como completado"
                      >
                        <input
                          type="checkbox"
                          disabled={!!item.num_factura}
                          checked={!!item.num_factura}
                          onChange={() => {}}
                          className="form-checkbox h-3 w-3 text-yellow-600 rounded mr-0 focus:ring-yellow-500"
                        />
                      </button>
                    </div>
                  </td>

                  {/* Acción para imprimir Factura */}
                  <td
                    onClick={() => handlePrint(item, "FACTURA")}
                    className="cursor-pointer px-6 py-4 text-center align-top text-sm group"
                  >
                    {/* Título del documento */}
                    <div className="font-semibold text-gray-800">
                      {item.num_factura ? item.num_factura : "-"}
                    </div>

                    {/* Fecha del documento opcionalmente */}
                    <div className="text-xs text-gray-500 mt-1">
                      {item.datefactura
                        ? dayjs(item.datefactura).format(
                            "dddd, D [de] MMMM [de] YYYY"
                          )
                        : ""}
                    </div>

                    {/* Botones debajo del título */}
                    <div className="mt-2 flex justify-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      {/* Botón Eliminar */}
                      {/* <button
                        onClick={(e) => {
                          e.stopPropagation(); // Evita que se dispare el onClick del td
                          handleDelete(item);
                        }}
                        className="inline-flex items-center justify-center w-8 h-8 rounded bg-red-600 hover:bg-red-700 text-white transition-all duration-200 focus:outline-none shadow-md"
                        title="Eliminar"
                      >
                        <FaTrashAlt size={12} />
                        <span className="sr-only">Eliminar</span>
                      </button> */}
                    </div>
                  </td>
                </tr>
              ))
            )}
            {/*Finaliza la tabla de Historial*/}
          </tbody>
        </table>
      </div>

      {/* Vista móvil: tarjetas */}
      <div className="block md:hidden space-y-4">
        {sortedProducts.length === 0 ? (
          <div className="py-6 text-center text-gray-500 italic">
            No hay documentos registrados.
          </div>
        ) : (
          sortedProducts.map((item, idx) => (
            <div
              key={idx}
              className="bg-white rounded-lg shadow p-4 border border-gray-200"
            >
              {/* Presupuesto */}
              <div className="mb-3">
                <p className="text-xs text-gray-500">Presupuesto</p>
                <p
                  onClick={() => handlePrint(item)}
                  className="font-semibold text-gray-800 cursor-pointer"
                >
                  {item.num_presupuesto || "-"}
                </p>
                <p className="text-xs text-gray-500">
                  {item.fecha_factura
                    ? dayjs(item.fecha_factura).format("DD/MM/YYYY")
                    : ""}
                </p>

                {/* Botón Editar */}
                <div className="mt-2">
                  <button
                    onClick={() => handleUpdate(item)}
                    className="px-3 py-1 text-xs rounded bg-blue-600 text-white hover:bg-blue-700"
                  >
                    Editar
                  </button>
                </div>
              </div>

              {/* Albarán */}
              <div className="mb-3">
                <p className="text-xs text-gray-500">Albarán</p>
                <p
                  onClick={() => handlePrint(item, "ALBARAN")}
                  className="font-semibold text-gray-800 cursor-pointer"
                >
                  {item.num_albaran || "-"}
                </p>
                <p className="text-xs text-gray-500">
                  {item.fecha_factalb
                    ? dayjs(item.fecha_factalb).format("DD/MM/YYYY")
                    : ""}
                </p>

                {/* Checklist Albarán */}
                <div className="mt-2">
                  <button
                    onClick={() => toggleChecklistItem(item.id, "1")}
                    disabled={!!item.num_albaran}
                    className={`inline-flex items-center space-x-2 px-3 py-1 text-xs rounded ${
                      !!item.num_albaran
                        ? "bg-gray-400 cursor-not-allowed text-white"
                        : "bg-yellow-500 hover:bg-yellow-600 text-white"
                    }`}
                  >
                    <input
                      type="checkbox"
                      disabled={!!item.num_albaran}
                      checked={!!item.num_albaran}
                      onChange={() => {}}
                      className="form-checkbox h-3 w-3 text-yellow-600 rounded"
                    />
                    <span>Checklist</span>
                  </button>
                </div>
              </div>

              {/* Factura */}
              <div>
                <p className="text-xs text-gray-500">Factura</p>
                <p
                  onClick={() => handlePrint(item, "FACTURA")}
                  className="font-semibold text-gray-800 cursor-pointer"
                >
                  {item.num_factura || "-"}
                </p>
                <p className="text-xs text-gray-500">
                  {item.datefactura
                    ? dayjs(item.datefactura).format("DD/MM/YYYY")
                    : ""}
                </p>

                {/* Checklist Factura */}
                <div className="mt-2">
                  <button
                    onClick={() => toggleChecklistItem(item.id, "2")}
                    disabled={!!item.num_factura}
                    className={`inline-flex items-center space-x-2 px-3 py-1 text-xs rounded ${
                      !!item.num_factura
                        ? "bg-gray-400 cursor-not-allowed text-white"
                        : "bg-yellow-500 hover:bg-yellow-600 text-white"
                    }`}
                  >
                    <input
                      type="checkbox"
                      disabled={!!item.num_factura}
                      checked={!!item.num_factura}
                      onChange={() => {}}
                      className="form-checkbox h-3 w-3 text-yellow-600 rounded"
                    />
                    <span>Checklist</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal reutilizable */}
      <HistoryModals
        isOpen={showModalSearch}
        onClose={() => setShowModalSearch(false)}
        title="Logo TableDocument"
        selectedItem={selectedItem}
        searchTerm={searchTerm}
      />

      <DateModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveDate}
        initialDate={documentDate}
      />
    </div>
  );
};
