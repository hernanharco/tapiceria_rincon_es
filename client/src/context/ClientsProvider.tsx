import { createContext, useContext, useState, useEffect, useCallback, useMemo, useRef } from 'react';
import api from '@/api/config';

const ClientsContext = createContext();

export const useApiClientsContext = () => {
  const context = useContext(ClientsContext);
  if (!context) throw new Error('useApiClientsContext debe usarse dentro de ClientsProvider');
  return context;
};

export const ClientsProvider = ({ children }) => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Usamos useRef para el tiempo. Las referencias NO disparan re-renders ni cambian la función.
  const lastFetchedRef = useRef(0);

  const ENDPOINT = '/api/clients/';

  // 1. Carga Ultra-Estable: CERO dependencias []
  const refetchClients = useCallback(async (silent = false) => {
    const ahora = Date.now();
    
    // Si es carga silenciosa y pasaron menos de 30s, abortamos
    if (silent && ahora - lastFetchedRef.current < 30000) return;

    if (!silent && clients.length === 0) setLoading(true);
    
    try {
      const res = await api.get(ENDPOINT);
      setClients(res.data);
      lastFetchedRef.current = ahora; // Actualizamos la referencia (no dispara bucle)
      setError(null);
    } catch (err) {
      setError('Error de conexión.');
      console.error("Error al cargar clientes:", err);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // 👈 AL SER VACÍO, LA FUNCIÓN NUNCA CAMBIA. EL BUCLE SE ROMPE AQUÍ.

  // 2. CRUD (Sin cambios, ya eran estables)
  const addClients = async (cliente) => {
    try {
      const res = await api.post(ENDPOINT, cliente);
      setClients((prev) => [...prev, res.data]);
      return res.data;
    } catch (err) {
      console.error("Error al crear:", err);
      throw new Error('Error al guardar.');
    }
  };

  const updateClients = async (cif, cliente) => {
    try {
      const res = await api.patch(`${ENDPOINT}${cif}/`, cliente);
      setClients((prev) => prev.map((c) => (c.cif === cif ? res.data : c)));
      return res.data;
    } catch (err) {
      console.error("Error al actualizar:", err);
      throw new Error('Error al actualizar.');
    }
  };

  const deleteClients = async (cif) => {
    try {
      await api.delete(`${ENDPOINT}${cif}/`);
      setClients((prev) => prev.filter((c) => c.cif !== cif));
    } catch (err) {
      console.error("Error al eliminar:", err);
      throw new Error('Error al eliminar.');
    }
  };

  // 3. Filtro local
  const getFilteredClients = useCallback((term) => {
    if (!term.trim()) return [];
    const lowerTerm = term.toLowerCase();
    return clients.filter(c => 
      c.name?.toLowerCase().includes(lowerTerm) || 
      c.cif?.toLowerCase().includes(lowerTerm)
    );
  }, [clients]);

  // useEffect se ejecuta UNA SOLA VEZ al montar
  useEffect(() => {
    refetchClients();
  }, [refetchClients]);

  const value = useMemo(() => ({
    clients,
    loading,
    error,
    refetchClients,
    addClients,
    deleteClients,
    updateClients,
    getFilteredClients,
  }), [clients, loading, error, refetchClients, getFilteredClients]);

  return (
    <ClientsContext.Provider value={value}>
      {loading && clients.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-50 text-gray-600">
           <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mb-4"></div>
           <p className="italic">Sincronizando con Frankfurt...</p>
        </div>
      ) : (
        children
      )}
    </ClientsContext.Provider>
  );
};