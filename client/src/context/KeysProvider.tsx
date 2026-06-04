import { createContext, useContext, type ReactNode } from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const KeysContext = createContext<any>(null);

export const useApiKeysContext = () => {
    const context = useContext(KeysContext);
    if (!context) {
        throw new Error('useApiKeysContext debe usarse dentro de KeysProvider');
    }
    return context;
};

export const KeysProvider = ({ children }: { children: ReactNode }) => {
    const value = {
        pagos: [],
        loading: false,
        error: null,
        refetchclientes: () => {},
    };

    return (
        <KeysContext.Provider value={value}>
            {children}
        </KeysContext.Provider>
    );
};
