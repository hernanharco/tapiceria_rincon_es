import { createContext, useContext, useState, useEffect, useCallback, useMemo, useRef } from 'react';
import api from '@/api/config';

const PagosContext = createContext();

export const useApiPagosContext = () => {
  const context = useContext(PagosContext);
  if (!context) {
    throw new Error('useApiPagosContext debe usarse dentro de PagosProvider');
  }
  return context;
};

export const PagosProvider = ({ children }) => {
  const [pagos, setPagos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Referencia para evitar bucles infinitos en el useEffect
  const lastFetchedRef = useRef(0);

  const ENDPOINT = '/api/pagos/';

  // 1. Cargar pagos (Estable y seguro contra bucles)
  const cargarPagos = useCallback(async (silent = false) => {
    const ahora = Date.now();
    // Cache de 30 segundos para evitar saturar Frankfurt
    if (silent && ahora - lastFetchedRef.current < 30000) return;

    if (!silent && pagos.length === 0) setLoading(true);
    
    try {
      const res = await api.get(ENDPOINT);
      setPagos(res.data);
      lastFetchedRef.current = ahora;
      setError(null);
    } catch (err) {
      console.error("Error al cargar pagos:", err); // ✅ err usado para ESLint
      setError("No se pudieron cargar los pagos.");
    } finally {
      setLoading(false);
    }
  }, [pagos.length]);

  // 2. Búsqueda LOCAL (Instantánea)
  // Ya no pedimos al servidor "?cliente=...", usamos lo que ya tenemos en memoria
  const getPagosByClienteId = useCallback((clienteId) => {
    if (!clienteId) return [];
    // Filtramos localmente: mucho más rápido que una petición de red
    return pagos.filter(p => p.cliente === clienteId);
  }, [pagos]);

  // 3. Efecto de carga inicial blindado
  useEffect(() => {
    cargarPagos();
  }, [cargarPagos]);

  const value = useMemo(() => ({
    pagos,
    loading,
    error,
    refetchPagos: cargarPagos,
    getPagosByClienteId, 
  }), [pagos, loading, error, cargarPagos, getPagosByClienteId]);

  return (
    <PagosContext.Provider value={value}>
      {loading && pagos.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-6 bg-gray-50 rounded-lg">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-600 mb-2"></div>
          <p className="text-sm text-gray-500 italic">Sincronizando pagos...</p>
        </div>
      ) : (
        children
      )}
    </PagosContext.Provider>
  );
};