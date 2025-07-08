// Esta clase se encarga de dibujar la tabla que se muestra en la parte de abajo según el cliente buscado
import { useState, useEffect } from "react";
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
  searchTerm,
  allClients,
}) => {
  const { toggleChecklistItemProvider, toggleChecklistItemFalse } =
    useHistoryTableDocument();
  const { getDocumentByDoc, deleteProduct, getAllDocuments, refetch } =
    useDocuments();

  const [showModalSearch, setShowModalSearch] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isDisabled, setIsDisabled] = useState(true); // Deshabilitado al inicio
  const [completedItems, setCompletedItems] = useState(new Set());
  // Estado para ordenamiento
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "asc",
  });

  const navigate = useNavigate();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpenFact, setIsModalOpenFact] = useState(false);
  const [documentDate, setDocumentDate] = useState("");

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
        if (!cif || !searchTerm.trim()) {
          const allDocs = await getAllDocuments();
          filteredDocs = allClients.flatMap((client) => {
            const clientDocs = allDocs.filter(
              (doc) => doc.dataclient === client.cif
            );
            return clientDocs.map((doc) => ({
              ...doc,
              clienteNombre: client.name,
            }));
          });
        } else {
          const indexDocuments = String(cif).trim();
          filteredDocs = await getDocumentByDoc(indexDocuments);
        }

        const sortedDocs = sortDocumentsByDate(filteredDocs || []);
        setFilteredProducts(sortedDocs);
        setIsDisabled(!cif && !searchTerm.trim());
      } catch (error) {
        console.error("Error al obtener documentos:", error);
        setFilteredProducts([]);
      }
    };
    fetchDocuments();
  }, [cif, searchTerm, refetch]);

  // Función para ordenar
  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  // Ordena los productos según el estado actual
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

  //Funcion para el manejo de boton de seleccionar ALBARAN
  const [itemIdToCheck, setItemIdToCheck] = useState(null);
  const [opcItem, setOpcItem] = useState()

  const toggleChecklistItem = (itemId, opc) => {
    setItemIdToCheck(itemId); // Guardamos el itemId
    setIsModalOpen(true); // Abrimos el modal
    setOpcItem(opc)    
  };

  const handleSaveDate = (date, opc) => {
    console.log("Fecha guardada:", date);
    setDocumentDate(date);

    if (itemIdToCheck && date) {
      setCompletedItems((prev) => {
        const newSet = new Set(prev);
        if (newSet.has(itemIdToCheck)) {
          newSet.delete(itemIdToCheck);
          console.log("Desmarcado:", itemIdToCheck);
          toggleChecklistItemFalse(itemIdToCheck, opcItem);
        } else {
          newSet.add(itemIdToCheck);
          console.log("Marcado:", itemIdToCheck);
          toggleChecklistItemProvider(itemIdToCheck, date, opcItem);
        }
        return newSet;
      });

      // Opcional: resetear el itemId después de usarlo
      setItemIdToCheck(null);
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
                      <button
                        onClick={(e) => {
                          e.stopPropagation(); // Evita que se dispare el onClick del td
                          handleDelete(item);
                        }}
                        className="inline-flex items-center justify-center w-8 h-8 rounded bg-red-600 hover:bg-red-700 text-white transition-all duration-200 focus:outline-none shadow-md"
                        title="Eliminar"
                      >
                        <FaTrashAlt size={12} />
                        <span className="sr-only">Eliminar</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
            {/*Finaliza la tabla de Historial*/}
          </tbody>
        </table>
      </div>

      {/* Tarjetas visibles solo en móvil */}
      <div className="md:hidden grid gap-4 px-4">
        {/* Botón Agregar Nuevo Documento */}
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
        {/*Finaliza el boton Agregar Nuevo Documento*/}
        {sortedProducts.length === 0 ? (
          <div className="text-center py-4 text-gray-500 italic">
            No hay documentos registrados.
          </div>
        ) : (
          sortedProducts.map((item, idx) => (
            <div
              key={idx}
              className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm"
            >
              <div className="space-y-2">
                <div>
                  <strong className="text-gray-600">Fecha:</strong>{" "}
                  <span className="text-gray-800">
                    {item.fecha_factura
                      ? dayjs(item.fecha_factura).format(
                          "dddd, D [de] MMMM [de] YYYY"
                        )
                      : dayjs().format("dddd, D [de] MMMM [de] YYYY")}
                  </span>
                </div>
                <div
                  onClick={() => handlePrint(item)}
                  className="cursor-pointer"
                >
                  <strong className="text-gray-600">Presupuesto:</strong>{" "}
                  <span className="text-gray-800">
                    {item.num_presupuesto ? item.num_presupuesto : "-"}
                  </span>
                </div>
                <div
                  onClick={() => handlePrint(item, "ALBARAN")}
                  className="cursor-pointer"
                >
                  <strong className="text-gray-600">Albarán:</strong>{" "}
                  <span className="text-gray-800">
                    {item.num_albaran ? item.num_albaran : "-"}
                  </span>
                </div>
                <div
                  onClick={() => handlePrint(item, "FACTURA")}
                  className="cursor-pointer"
                >
                  <strong className="text-gray-600">Factura:</strong>{" "}
                  <span className="text-gray-800">
                    {item.num_factura ? item.num_factura : "-"}
                  </span>
                </div>
                <div className="flex justify-between pt-2 mt-2 border-t border-gray-200">
                  <button
                    onClick={() => handleUpdate(item)}
                    className="text-blue-600 hover:text-blue-800 flex items-center"
                  >
                    <FaEdit className="mr-1" /> Editar
                  </button>
                  <button
                    onClick={() => handleDelete(item)}
                    className="text-red-600 hover:text-red-800 flex items-center"
                  >
                    <FaTrashAlt className="mr-1" /> Eliminar
                  </button>
                  {/* <button
                    onClick={() => handlePrint(item)}
                    className="text-green-600 hover:text-green-800 flex items-center"
                  >
                    <FaPrint className="mr-1" /> Imprimir
                  </button> */}
                  {/* Botón Checklist */}
                  <button
                    onClick={() => toggleChecklistItem()}
                    disabled={!!item.num_factura}
                    className="cursor-pointer inline-flex items-center justify-center px-3 py-2 rounded-lg bg-yellow-500 hover:bg-yellow-600 text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400 shadow-md hover:shadow-lg"
                    title="Marcar como completado"
                  >
                    <input
                      type="checkbox"
                      className="form-checkbox h-4 w-4 text-yellow-600 rounded transition duration-150 ease-in-out mr-1 focus:ring-yellow-500"
                      disabled={!!item.num_factura}
                      checked={!!item.num_factura}
                      onChange={() => toggleChecklistItem(item.id)}
                    />
                    <span className="text-xs font-medium whitespace-nowrap"></span>
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
