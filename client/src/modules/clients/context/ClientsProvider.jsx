import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

// Configuración global
const API_URL = 'http://localhost:8000/api/clients/';

// 1. Creamos el Contexto
const ClientsContext = createContext();

// 2. Hook para usar el contexto fácilmente
export const useApiClientsContext = () => {
  const context = useContext(ClientsContext);
  if (!context) {
    throw new Error('useApiClientsContext debe usarse dentro de ClientsProvider');
  }
  return context;
};

// 3. Proveedor de estado – Con búsqueda conectada al backend
export const ClientsProvider = ({ children }) => {
  const [clients, setClients] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]); // ✅ Resultados de búsqueda
  const [loading, setLoading] = useState(true);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [error, setError] = useState(null);

  // Cargar todos los clientes desde Django
  const refetchClients = async () => {
    try {
      const res = await axios.get(API_URL); // ✅ Usamos la variable
      setClients(res.data); // ✅ Axios ya parsea JSON
    } catch (err) {
      setError('No se pudieron cargar los clientes.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Crear cliente
  const addClients = async (cliente) => {
    try {
      const res = await axios.post(API_URL, cliente); // ✅ Enviamos datos directamente
      setClients([...clients, res.data]); // ✅ Agregar nuevo cliente a la lista
    } catch (err) {
      console.error('Error al crear cliente:', err.response?.data || err.message);
      throw new Error('No se pudo guardar el cliente.');
    }
  };

  // Eliminar cliente por CIF
  const deleteClients = async (cif) => {
    try {
      await axios.delete(`${API_URL}${cif}/`);
      setClients(clients.filter((client) => client.cif !== cif));
    } catch (err) {
      console.error('Error al eliminar cliente:', err.response?.data || err.message);
      throw new Error('No se pudo eliminar el cliente.');
    }
  };

  // Actualizar cliente por CIF
  const updateClients = async (cif, cliente) => {
    try {
      const res = await axios.put(`${API_URL}${cif}/`, cliente);
      setClients(clients.map((c) => (c.cif === cif ? res.data : c)));
    } catch (err) {
      console.error('Error al actualizar cliente:', err.response?.data || err.message);
      throw new Error('No se pudo actualizar el cliente.');
    }
  };

  // Buscar cliente por CIF exacto
  const getClientByCif = async (cif) => {
    try {
      const res = await axios.get(`${API_URL}${cif}/`);
      return res.data;
    } catch (err) {
      console.error('Error al buscar cliente por CIF:', err.response?.data || err.message);
      setError(`No se pudo encontrar el cliente con CIF: ${cif}`);
      return null;
    }
  };

  // Buscar clientes con término de búsqueda
  const fetchClientsFromBackend = async (term) => {
    if (!term.trim()) {
      setFilteredClients([]);
      return;
    }

    setLoadingSearch(true);

    try {
      const res = await axios.get(`${API_URL}?q=${encodeURIComponent(term)}`);
      setFilteredClients(res.data);
    } catch (err) {
      console.error('Error al buscar clientes:', err.response?.data || err.message);
      setFilteredClients([]);
    } finally {
      setLoadingSearch(false);
    }
  };

  // Cargar datos iniciales
  useEffect(() => {
    refetchClients();
  }, []);

  // Valor compartido a través del contexto
  const value = {
    clients,
    filteredClients,
    loading,
    loadingSearch,
    error,

    // Funciones
    refetchClients,
    addClients,
    deleteClients,
    updateClients,
    fetchClientsFromBackend,
    getClientByCif,
  };

  return (
    <ClientsContext.Provider value={value}>
      {!loading ? children : <div>Cargando datos...</div>}
    </ClientsContext.Provider>
  );
};