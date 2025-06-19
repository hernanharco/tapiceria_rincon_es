import { useEffect, useState, useRef } from 'react';

// Importamos los componentes necesarios
import { TableDocuments } from './TableDocuments';
import useDocuments from '../hooks/useDocuments'

export const DocumentsInfo = ({
    isOpen = true,
    cif = '',
    numDocument = '', // valor inicial desde props
    date = '',
    setDate = () => { },
    observation = '',
    setObservation = () => { },
    search = () => { },
}) => {

    const [localNumDocument, setLocalNumDocument] = useState(numDocument); // ✅ Usamos otro nombre    
    const { addProduct, getDocumentByDoc } = useDocuments();
    // const isInitialMount = useRef(true);
    const userChangedDate = useRef(false);

    // Este useEffect se ejecuta SOLO UNA VEZ al cargar el componente
    useEffect(() => {
        setDate("00/00/0000");
    }, []); // <-- Arreglo vacío = se ejecuta solo una vez

    // 1. Asignar número de documento al cargar documentos
    useEffect(() => {
        const fetchClientDocuments = async () => {
            if (!cif) return;

            try {
                const response = await getDocumentByDoc(cif);

                // console.log("typeof response:", typeof response);
                // console.log("response completo:", response);

                // Verificar si es un array y tiene datos
                if (!Array.isArray(response) || response.length === 0) {
                    // console.log("No hay documentos válidos");
                    setLocalNumDocument("1");
                    return;
                }

                // Obtener el último documento
                const lastDocument = response[response.length - 1];
                const currentNum = parseInt(lastDocument.num_presupuesto, 10);

                if (!isNaN(currentNum)) {
                    const nextNum = (currentNum + 1).toString();
                    setLocalNumDocument(nextNum);
                    return;
                }

                // Si no hay datos válidos, asignamos "1"
                // console.log("No se encontró número de presupuesto válido");
                setLocalNumDocument("1");

            } catch (error) {
                console.error("Error al obtener documentos del cliente:", error);
                setLocalNumDocument("1"); // Fallback por seguridad
            }
        };

        if (isOpen) {
            fetchClientDocuments(); // Solo ejecutamos cuando el componente está abierto
        }

    }, [isOpen, cif]);

    // 3. Función para guardar documento
    const saveDocument = () => {
        
        const saveToDocuments = {
            dataclient: cif,
            fecha_factura: date,
            observaciones: observation,
            num_presupuesto: localNumDocument
        };
        addProduct(saveToDocuments);
    };

    // 4. Ejecutar guardarDocumento apenas el componente se monta
    useEffect(() => {
        if (userChangedDate.current) {
            saveDocument();
            userChangedDate.current = false; // Resetear para próxima interacción
        }
    }, [date]);

    return (
        <div>
            <details open={!isOpen} className="p-4 border border-gray-300 rounded bg-gray-50">
                <summary className="font-semibold text-gray-700 mb-3 cursor-pointer">Información del Cliente</summary>

                {/* Campo Num. Presupuesto */}
                <div className="mb-3">
                    <label htmlFor="numPresupuesto" className="block text-sm font-semibold text-gray-700">
                        Num. Presupuesto.
                    </label>
                    <input
                        id="numPresupuesto"
                        type="text"
                        value={localNumDocument || "Cargando..."}
                        readOnly
                        className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md"
                    />
                </div>

                {/* Campo Fecha Presupuesto */}
                <div className="mb-3">
                    <label htmlFor="fechaPresupuesto" className="block text-sm font-semibold text-gray-700">
                        Fecha Presupuesto.
                    </label>
                    <input
                        id="fechaPresupuesto"
                        type="date"
                        value={date}
                        onChange={(e) => {
                            setDate(e.target.value);
                            userChangedDate.current = true; // 👈 Indicamos que el usuario cambió la fecha                          
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>

                {/* Campo Cod. Cliente */}
                <div className="mb-3">
                    <label htmlFor="codCliente" className="block text-sm font-semibold text-gray-700">
                        Cod. Cliente.
                    </label>
                    <input
                        id="codCliente"
                        type="text"
                        value={cif}
                        readOnly
                        className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md"
                    />
                </div>

                {/* Campo Observaciones */}
                <div className="mb-3">
                    <label htmlFor="observaciones" className="block text-sm font-semibold text-gray-700">
                        Observaciones.
                    </label>
                    <textarea
                        id="observaciones"
                        value={observation}
                        onChange={(e) => setObservation(e.target.value)}
                        rows="3"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Escribe aquí tus observaciones..."
                    />
                </div>
            </details>

            {/* Tabla u otros componentes - esta tabla lo que hace es comenzar agregar los productos */}
            <TableDocuments
                numDocument={localNumDocument}
                search={search}
            />
        </div>
    );
};