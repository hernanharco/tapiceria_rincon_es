
import { createContext, useContext, useState, useEffect } from 'react';

// 1. Crear el Contexto
const HistoryContext = createContext();

// 2. Hook para usar el contexto fácilmente
export const useApiHistoryContext = () => {
    const context = useContext(HistoryContext);
    if (!context) {
        throw new Error('useApiHistoryContext debe usarse dentro de HistoryProvider');
    }
    return context;
};

// 3. Proveedor de contexto con lógica interna
export const HistoryProvider = ({ children }) => {
    const initialCurrentDate = new Date().toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    });

    // Estados principales    
    const [error, setError] = useState(null);
    const [displayCurrentDate, setDisplayCurrentDate] = useState(initialCurrentDate);
    const [isAdding, setIsAdding] = useState(false);

    const initialNewDocumentState = {
        fecha_documento: initialCurrentDate,
        presupuesto: '',
        num_albaran: '',
        num_factura: '',
    };

    const [newDocument, setNewDocument] = useState(initialNewDocumentState);
    
    // Actualizar la fecha actual si cambia
    useEffect(() => {
        const interval = setInterval(() => {
            const updatedDate = new Date().toLocaleDateString('es-ES', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
            });
            setDisplayCurrentDate(updatedDate);
        }, 60000);
        return () => clearInterval(interval);
    }, []);

    // Manejador para abrir modal
    const handleAddButtonClick = () => {
        setIsAdding(true);
        setNewDocument({
            ...initialNewDocumentState,
            fecha_documento: new Date().toLocaleDateString('es-ES', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
            }),
        });
    };

    // Manejador de cambios en inputs
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewDocument(prev => ({ ...prev, [name]: value }));
    };

    // Guardar nuevo documento
    const handleSaveNewDocument = () => {
        console.log("Guardando:", newDocument);
        setIsAdding(false);
        setNewDocument(initialNewDocumentState);
    };

    // Cancelar añadido
    const handleCancelAdd = () => {
        setIsAdding(false);
        setNewDocument(initialNewDocumentState);
    };

    // Valor compartido a través del contexto
    const value = {        
        error,
        isAdding,
        displayCurrentDate,
        newDocument,
        handleAddButtonClick,
        handleInputChange,
        handleSaveNewDocument,
        handleCancelAdd,
        setNewDocument,        
        setError
    };    

    // Muestra error si ocurre uno
    if (error) {
        return <p className="p-6 text-red-500">Error al cargar documentos</p>;
    }

    // Si no hay error y no está cargando, mostramos los hijos
    return (
        <HistoryContext.Provider value={value}>
            {children}
        </HistoryContext.Provider>
    );
};