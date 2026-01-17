
import { createContext, useContext } from 'react';

// 1. Creamos el Contexto
const KeysContext = createContext();

// 2. Creamos un hook para usar el contexto
export const useApiKeysContext = () => {
    const context = useContext(KeysContext);
    if (!context) {
        throw new Error('useApiKeysContext debe usarse dentro de KeysProvider');
    }
    return context;
};

// 3. El Provider que carga los datos
export const KeysProvider = ({ children }) => {
    switch (e.key) {
        case 'ArrowDown':
            e.preventDefault();
            setActiveSuggestionIndex(prev =>
                prev < suggestions.length - 1 ? prev + 1 : prev
            );
            break;

        case 'ArrowUp':
            e.preventDefault();
            setActiveSuggestionIndex(prev => (prev > 0 ? prev - 1 : -1));
            break;

        case 'Enter':
            e.preventDefault();
            if (activeSuggestionIndex >= 0) {
                setSearchTerm(suggestions[activeSuggestionIndex].name);
                setShowSuggestions(false);
                setActiveSuggestionIndex(-1);
            }
            break;

        case 'Escape':
            setShowSuggestions(false);
            setActiveSuggestionIndex(-1);
            break;

        default:
            break;
    }

    const value = {
        pagos,
        loading,
        error,
        refetchclientes: cargarPagos,
    };

    return (
        <useApiKeysContext.Provider value={value}>
            {!loading ? children : <div>Cargando datos...</div>}
        </useApiKeysContext.Provider>
    );
};