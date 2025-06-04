
import useHistory from "../../hooks/useHistory";
import useDocuments from '../../hooks/useDocuments';

export const HistoryTableDocument = ({setShowModal}) => {    
    
    const { documents } = useDocuments();
    // console.log("Documentos:", documents);

    const {
        isAdding,
        handleInputChange,
        handleSaveNewDocument,
        handleCancelAdd,
        newDocument,
        displayCurrentDate
    } = useHistory();

    return (
        <div>
            {/* Tabla de documentos */}
            <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-md">
                <table className="min-w-full bg-white divide-y divide-gray-200">

                    <tbody className="bg-white divide-y divide-gray-200">
                        {/* Fila para añadir nuevo documento */}
                        {isAdding ? (
                            <tr key="add-row" className="bg-yellow-50 hover:bg-yellow-100 transition-colors duration-150">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <input
                                        type="text"
                                        name="fecha_documento"
                                        value={newDocument.fecha_documento}
                                        onChange={handleInputChange}
                                        placeholder="DD/MM/AAAA"
                                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    />
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <input
                                        type="text"
                                        name="presupuesto"
                                        value={newDocument.presupuesto}
                                        onChange={handleInputChange}
                                        placeholder="Nº Presupuesto"
                                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    />
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                                    <div className="flex justify-end space-x-2">
                                        <button
                                            onClick={handleSaveNewDocument}
                                            className="px-3 py-1.5 bg-blue-600 text-white text-xs font-semibold rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                        >
                                            Guardar
                                        </button>
                                        <button
                                            onClick={() => {
                                                handleCancelAdd();
                                                setShowModal(false);
                                            }}
                                            className="px-3 py-1.5 bg-gray-200 text-gray-700 text-xs font-semibold rounded-md shadow-sm hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
                                        >
                                            Cancelar
                                        </button>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <input
                                        type="text"
                                        name="num_albaran"
                                        value={newDocument.num_albaran}
                                        onChange={handleInputChange}
                                        placeholder="Nº Albarán"
                                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    />
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <input
                                        type="text"
                                        name="num_factura"
                                        value={newDocument.num_factura}
                                        onChange={handleInputChange}
                                        placeholder="Nº Factura"
                                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    />
                                </td>
                            </tr>
                        ) : (
                            <tr key="add-button-row">
                                <td colSpan="5" className="px-6 py-4 whitespace-nowrap">
                                    <button
                                        onClick={() => setShowModal(true)}
                                        className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                        aria-label="Agregar nuevo documento"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                        </svg>
                                        Agregar Nuevo Documento
                                    </button>
                                </td>
                            </tr>
                        )}

                        {/* Filas de documentos existentes */}
                        {documents.map((item, idx) => (
                            <tr key={idx} className="hover:bg-gray-50 transition-colors duration-150">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {item.fecha_documento || item.fecha_factura || displayCurrentDate}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {item.presupuesto ? item.presupuesto : '-'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {item.num_albaran ? item.num_albaran : '-'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {item.num_factura ? item.num_factura : '-'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                                    <div className="flex justify-end space-x-2">
                                        <button
                                            onClick={() => console.log("Editar", item.id)}
                                            className="text-yellow-500 hover:text-yellow-700"
                                        >
                                            ✏️
                                        </button>
                                        <button
                                            onClick={() => console.log("Eliminar", item.id)}
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}

                        {/* Mensaje si no hay documentos */}
                        {documents.length === 0 && !isAdding && (
                            <tr key="no-documents">
                                <td colSpan="5" className="py-4 text-center text-gray-500">
                                    No hay documentos registrados.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
