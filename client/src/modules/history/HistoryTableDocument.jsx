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
// Importamos el componente de búsqueda
import { HistoryModals } from "./HistoryModals";

export const HistoryTableDocument = ({
  setShowModal,
  searchTerm,
  allClients,
}) => {
  const { getDocumentByDoc, deleteProduct, getAllDocuments, refetch } =
    useDocuments();
  const [showModalSearch, setShowModalSearch] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isDisabled, setIsDisabled] = useState(true); // Deshabilitado al inicio
  const [isChecked, setIsChecked] = useState(false);
  // Estado para ordenamiento
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "asc",
  });

  const navigate = useNavigate();
  const { isAdding, displayCurrentDate } = useHistory();

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

  const handlePrint = (item) => {
    navigate(`/imprimir/${item.num_presupuesto}/${cif}`);
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
                onClick={() => requestSort("fecha_factura")}
              >
                <div className="flex items-center justify-center space-x-1">
                  <span>Fecha</span>
                  {sortConfig.key === "fecha_factura" ? (
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
                className="px-6 py-4 text-center text-sm font-semibold text-gray-700 uppercase tracking-wider"
              >
                Acciones
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
            {/* Botón Agregar Nuevo Documento */}
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
                  <td className="px-6 py-4 text-center text-sm text-gray-800">
                    {item.fecha_factura
                      ? dayjs(item.fecha_factura).format(
                          "dddd, D [de] MMMM [de] YYYY"
                        )
                      : dayjs().format("dddd, D [de] MMMM [de] YYYY")}
                  </td>
                  <td className="px-6 py-4 text-center text-sm text-gray-800">
                    {item.num_presupuesto ? item.num_presupuesto : "-"}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {/* botones */}
                    <div className="flex justify-center space-x-3 mt-2">
                      {/* Botón Actualizar */}
                      <button
                        onClick={() => handleUpdate(item)}
                        className="cursor-pointer inline-flex items-center justify-center w-10 h-10 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-md hover:shadow-lg"
                        title="Actualizar"
                      >
                        <FaEdit size={16} />
                        <span className="sr-only">Actualizar</span>
                      </button>

                      {/* Botón Eliminar */}
                      <button
                        onClick={() => handleDelete(item)}
                        className="cursor-pointer inline-flex items-center justify-center w-10 h-10 rounded-lg bg-red-600 hover:bg-red-700 text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 shadow-md hover:shadow-lg"
                        title="Eliminar"
                      >
                        <FaTrashAlt size={16} />
                        <span className="sr-only">Eliminar</span>
                      </button>

                      {/* Botón Imprimir */}
                      <button
                        onClick={() => handlePrint(item)}
                        className="cursor-pointer inline-flex items-center justify-center w-10 h-10 rounded-lg bg-green-600 hover:bg-green-700 text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 shadow-md hover:shadow-lg"
                        title="Imprimir"
                      >
                        <FaPrint size={16} />
                        <span className="sr-only">Imprimir</span>
                      </button>

                      {/* Botón Checklist */}
                      <button
                        onClick={(e) => {
                          e.preventDefault(); // Evita comportamiento no deseado si envuelve formularios
                          // Aquí puedes llamar a toggleChecklistItem() si usas estado
                        }}
                        className="cursor-pointer inline-flex items-center justify-center px-3 py-2 rounded-lg bg-yellow-500 hover:bg-yellow-600 text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400 shadow-md hover:shadow-lg"
                        title="Marcar como completado"
                      >
                        <input
                          type="checkbox"
                          className="form-checkbox h-4 w-4 text-yellow-600 rounded transition duration-150 ease-in-out mr-1 focus:ring-yellow-500"
                          checked={isChecked}
                          onChange={(e) => setIsChecked(e.target.checked)}
                        />
                        <span className="text-xs font-medium whitespace-nowrap">
                          
                        </span>
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center text-sm text-gray-600">
                    {item.num_albaran ? item.num_albaran : "-"}
                  </td>
                  <td className="px-6 py-4 text-center text-sm text-gray-600">
                    {item.num_factura ? item.num_factura : "-"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Tarjetas visibles solo en móvil */}
      <div className="md:hidden grid gap-4 px-4">
        {/* Botón Agregar Nuevo Documento */}
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
                <div>
                  <strong className="text-gray-600">Presupuesto:</strong>{" "}
                  <span className="text-gray-800">
                    {item.num_presupuesto ? item.num_presupuesto : "-"}
                  </span>
                </div>
                <div>
                  <strong className="text-gray-600">Albarán:</strong>{" "}
                  <span className="text-gray-800">
                    {item.num_albaran ? item.num_albaran : "-"}
                  </span>
                </div>
                <div>
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
                  <button
                    onClick={() => handlePrint(item)}
                    className="text-green-600 hover:text-green-800 flex items-center"
                  >
                    <FaPrint className="mr-1" /> Imprimir
                  </button>
                  {/* //boton */}
                  <button
                    onClick={() => handlePrint(item)}
                    className="text-green-600 hover:text-green-800 flex items-center"
                  >
                    <FaPrint className="mr-1" /> OTRO
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
    </div>
  );
};
