
import { useState, useEffect } from "react";
import { FaEdit, FaTrashAlt, FaPrint } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';

// Importamos los hooks necesarios
import useHistory from "./hooks/useHistory";
import useDocuments from '../documents/hooks/useDocuments'; // Asegúrate de que la ruta es correcta

// Importamos el componente de búsqueda
import { HistoryModalsSearch } from "./HistoryModalsSearch";

export const HistoryTableDocument = ({ setShowModal, searchTerm }) => {
    const { getDocumentsByNum, deleteProduct } = useDocuments();
    const [showModalSearch, setShowModalSearch] = useState(false);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [selectedItem, setSelectedItem] = useState([])
    const [isDisabled, setIsDisabled] = useState(true); // Deshabilitado al inicio

    // Dentro de tu componente:
    const navigate = useNavigate();

    const {
        isAdding,
        displayCurrentDate
    } = useHistory();

    // Función para extraer CIF y nombre
    const parseSearchTerm = (value) => {
        const match = value.match(/^\(([^)]+)\)\s*(.*)/);
        return {
            cif: match ? match[1] : '',
            name: match ? match[2] : value,
        };
    };

    const { cif, name } = parseSearchTerm(searchTerm); // Desestructuramos los valores
    // console.log("Traemos el cif HistoryTableDocument:", cif)  

    // Filtrar productos cada vez que cambie numDocument
    useEffect(() => {
        if (!cif) {
            setFilteredProducts([]);
            setIsDisabled(true);
            return;
        }

        const index = String(cif).trim();
        const results = getDocumentsByNum(index);
        setFilteredProducts(results || []);
        setIsDisabled(false);
    }, [cif, getDocumentsByNum]);

    // 
    const handleUpdate = (item) => {
        setSelectedItem({
            num_factura: item.num_factura,
            cod_cliente: item.cod_cliente,
            fecha_factura: item.fecha_factura,
            observaciones: item.observaciones,
        });
        setShowModalSearch(true);
    };

    const handleDelete = async (item) => {
        if (
            window.confirm(
                `¿Estás seguro de eliminar el registro con número: ${item.num_factura}?`
            )
        ) {
            try {
                console.log("Eliminar documento:", item.num_factura);
                await deleteProduct(item.num_factura); // Elimina del backend

                // Actualizar la lista local
                const updatedList = getDocumentsByNum(cif); // Recargamos los documentos del cliente
                setFilteredProducts(updatedList); // Actualizamos la tabla localmente

                alert("Documento eliminado correctamente");
            } catch (error) {
                console.error("Error al eliminar el documento:", error);

                if (error.response) {
                    console.error("Datos del error desde el servidor:", error.response.data);
                    alert(
                        `Error del servidor: ${error.response.status} - ${error.response.data.message || "No se pudo eliminar"
                        }`
                    );
                } else if (error.request) {
                    console.error("No hubo respuesta del servidor:", error.request);
                    alert("No se recibió respuesta del servidor.");
                } else {
                    console.error("Error desconocido:", error.message);
                    alert(`Ocurrió un error: ${error.message}`);
                }
            }
        }
    };

    const handlePrint = (item) => {

        navigate(`/imprimir/${item.num_factura}/${cif}`);
    };

    return (
        <div>
            {/* Tabla de documentos */}
            <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-md">
                <table className="min-w-full bg-white divide-y divide-gray-200">
                    {/* Títulos de la tabla */}
                    <thead className="bg-gray-100">
                        <tr>
                            <th scope="col" className="px-6 py-4 text-center text-sm font-semibold text-gray-700 uppercase tracking-wider">
                                Fecha
                            </th>
                            <th scope="col" className="px-6 py-4 text-center text-sm font-semibold text-gray-700 uppercase tracking-wider">
                                Presupuesto
                            </th>
                            <th scope="col" className="px-6 py-4 text-center text-sm font-semibold text-gray-700 uppercase tracking-wider">
                                Acciones
                            </th>
                            <th scope="col" className="px-6 py-4 text-center text-sm font-semibold text-gray-700 uppercase tracking-wider">
                                Albarán
                            </th>
                            <th scope="col" className="px-6 py-4 text-center text-sm font-semibold text-gray-700 uppercase tracking-wider">
                                Factura
                            </th>
                        </tr>
                    </thead>

                    {/* Cuerpo de la tabla */}
                    <tbody className="divide-y divide-gray-200">
                        {/* Botón Agregar Nuevo Documento */}
                        <tr key="add-button-row">
                            <td colSpan="5" className="px-6 py-4 text-center">
                                <button
                                    onClick={() => setShowModal(true)}
                                    disabled={isDisabled}
                                    className={`inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white transition-colors duration-200 
                                    ${isDisabled
                                            ? 'bg-gray-400 cursor-not-allowed'
                                            : 'bg-green-600 hover:bg-green-700 focus:ring-green-500'
                                        } focus:outline-none focus:ring-2 focus:ring-offset-2`}
                                    aria-label="Agregar nuevo documento"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                    </svg>
                                    Agregar Nuevo Documento
                                </button>
                            </td>
                        </tr>

                        {/* Filas de documentos */}
                        {filteredProducts.map((item, idx) => (
                            <tr key={idx} className="hover:bg-gray-50 transition-colors duration-150">
                                {/* Columna Fecha */}
                                <td className="px-6 py-4 text-center text-sm text-gray-800">
                                    {item.fecha_documento || item.fecha_factura || displayCurrentDate}
                                </td>

                                {/* Columna Presupuesto */}
                                <td className="px-6 py-4 text-center text-sm text-gray-800">
                                    {item.num_factura ? item.num_factura : '-'}
                                </td>

                                {/* Columna Acciones */}
                                <td className="px-6 py-4 text-center">
                                    <div className="flex justify-center space-x-2">
                                        {/* Botón Actualizar */}
                                        <button
                                            onClick={() => handleUpdate(item)} // Pasamos el item completo o solo el ID
                                            className="cursor-pointer  inline-flex items-center justify-center w-8 h-8 rounded-md bg-blue-600 hover:bg-blue-700 text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                            title="Actualizar"
                                        >
                                            <FaEdit size={14} />
                                            <span className="sr-only">Actualizar</span>
                                        </button>

                                        {/* Botón Eliminar */}
                                        <button
                                            onClick={() => handleDelete(item)}
                                            className="cursor-pointer  inline-flex items-center justify-center w-8 h-8 rounded-md bg-red-600 hover:bg-red-700 text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                            title="Eliminar"
                                        >
                                            <FaTrashAlt size={14} />
                                            <span className="sr-only">Eliminar</span>
                                        </button>

                                        {/* Botón Imprimir */}
                                        <button
                                            onClick={() => handlePrint(item)}
                                            className="cursor-pointer inline-flex items-center justify-center w-8 h-8 rounded-md bg-green-600 hover:bg-green-700 text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                            title="Imprimir"
                                        >
                                            <FaPrint size={14} />
                                            <span className="sr-only">Imprimir</span>
                                        </button>
                                    </div>
                                </td>

                                {/* Columna Albarán */}
                                <td className="px-6 py-4 text-center text-sm text-gray-600">
                                    {item.num_albaran ? item.num_albaran : '-'}
                                </td>

                                {/* Columna Factura */}
                                <td className="px-6 py-4 text-center text-sm text-gray-600">
                                    {item.num_factura ? item.num_factura : '-'}
                                </td>
                            </tr>
                        ))}

                        {/* Mensaje si no hay documentos */}
                        {filteredProducts.length === 0 && !isAdding && (
                            <tr key="no-documents">
                                <td colSpan="5" className="py-6 text-center text-gray-500 italic">
                                    No hay documentos registrados.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal reutilizable */}
            <HistoryModalsSearch
                isOpen={showModalSearch}
                onClose={() => setShowModalSearch(false)}
                title="Logo TableDocument"
                selectedItem={selectedItem}
            >
            </HistoryModalsSearch>



        </div >
    );
};