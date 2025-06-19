
import { useState } from 'react';
import { DocumentsInfo } from '../documents/components/DocumentsInfo';

export const HistoryModalsSearch = ({ isOpen, onClose, title, children, selectedItem }) => {

    const [search, setSearch] = useState(true)

    // Validación para mostrar información del cliente  
    // console.log("Informacion desde HistoryModals:", searchTerm);

    // Función para extraer CIF y nombre
    //   const parseSearchTerm = (value) => {
    //     const match = value.match(/^\(([^)]+)\)\s*(.*)/);
    //     return {
    //       cif: match ? match[1] : '',
    //       name: match ? match[2] : value,
    //     };
    //   };

    //   const { cif, name } = parseSearchTerm(searchTerm); // Desestructuramos los valores  

    if (!isOpen) return null;

    // Manejador de guardar/editar producto
    const handleSaveProduct = async () => {
        console.log("estoy en guardar informacion");
    };

    return (
        <div>
            {/* Fondo oscuro */}
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                {/* Contenedor del modal con scroll */}
                <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl max-h-[80vh] overflow-y-auto p-6 relative mx-4">

                    {/* Botón de cierre (X) */}
                    <div>
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-2xl font-bold"
                            aria-label="Cerrar modal"
                        >
                            &times;
                        </button>                        

                    </div>

                    {/* Título */}
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">{title}</h3>

                    {/* Contenido dinámico */}
                    <div className="mb-6">
                        {children}
                    </div>

                    {/* Consultar Informacion de los datos del Documento */}
                    <DocumentsInfo
                        cif={selectedItem.cod_cliente}
                        numDocument={selectedItem.num_factura}
                        date={selectedItem.fecha_factura}
                        observation={selectedItem.observaciones}                  

                        search={search}
                    />                    

                    {/* Botones inferiores */}
                    <div className="flex justify-end space-x-3 mt-4">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                            Cerrar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};