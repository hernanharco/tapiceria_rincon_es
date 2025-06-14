
import { TableDocuments } from './TableDocuments';
import useDocuments from '../hooks/useDocuments';
import { useEffect } from 'react';

export const DocumentsInfo = ({
    isOpen = false,
    cif = '',
    numDocument = '',
    setNumDocument = () => { }, // Función vacía si no se pasa
    date = '',
    setDate = () => { },
    observation = '',
    setObservation = () => { },
    search = () => { },
}) => {

    const { documents, addProduct } = useDocuments();

    // Función pura para calcular el siguiente número de presupuesto
    const getNextNumBudget = (docs) => {
        if (!docs || docs.length === 0) return "1";

        const numbersBudget = docs
            .map(doc => parseInt(doc.num_factura, 10))
            .filter(n => !isNaN(n));

        const maxNumFactura = Math.max(...numbersBudget);
        const nextNumBudget = !isNaN(maxNumFactura) ? maxNumFactura + 1 : 1;
        return nextNumBudget.toString();
    };

    // 1. Asignar número de documento al cargar documentos
    useEffect(() => {  
        console.log("HistoryTableDocuments search", search)      
        if (search) {
            console.log("estoy en HistoryTableDocuments en usseEffect", documents)
            const nextNum = getNextNumBudget(documents);
            if (nextNum !== numDocument) {
                setNumDocument(nextNum);
            }
            // Reseteamos la fecha para que aparezca vacia
            setDate("00/00/0000");
        }

    }, [isOpen]);

    // 2. Establecer la fecha automática solo una vez al abrir
    useEffect(() => {
        // console.log("Date", date)
        if (isOpen && (!date || date.trim() === '')) {
            const today = new Date().toISOString().split('T')[0]; // Formato YYYY-MM-DD
            setDate(today);
        }
    }, [isOpen, date]);

    // 3. Función para guardar documento
    const saveDocument = () => {
        const dataToSave = {
            cod_cliente: cif,
            num_factura: numDocument,
            fecha_factura: date,
            observaciones: observation
        };
        console.log("DataToSave", dataToSave)
        addProduct(dataToSave);
    };

    // 4. Ejecutar guardarDocumento apenas el componente se monta
    useEffect(() => {
        saveDocument(); // Se ejecuta solo una vez         
        
    }, [date]);

    return (
        <div>
            <details open={isOpen} className="p-4 border border-gray-300 rounded bg-gray-50">
                <summary className="font-semibold text-gray-700 mb-3 cursor-pointer">Información del Cliente</summary>

                {/* Campo Num. Presupuesto */}
                <div className="mb-3">
                    <label htmlFor="numPresupuesto" className="block text-sm font-semibold text-gray-700">
                        Num. Presupuesto.
                    </label>
                    <input
                        id="numPresupuesto"
                        type="text"
                        value={numDocument}
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
                        onChange={(e) => setDate(e.target.value)}
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
                numDocument={numDocument}
                search={search}
            />
        </div>
    );
};