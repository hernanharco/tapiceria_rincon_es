import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estados para búsqueda
  const [searchClient, setSearchClient] = useState('');
  const [filteredClients, setFilteredClients] = useState([]);
  const [loadingSearch, setLoadingSearch] = useState(false);

  // Cargar todos los clientes desde Django
  const cargarClientes = async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/clients/');
      setClients(res.data);
    } catch (err) {
      setError(err.response?.data || 'Error al cargar clientes');
    } finally {
      setLoading(false);
    }
  };

  // Insertar nuevo cliente
  const addClients = async (newClient) => {
    try {
      const response = await axios.post('http://localhost:8000/api/clients/', newClient);
      setClients(prev => [...prev, response.data]);
      return response.data;
    } catch (err) {
      setError(err.response?.data || 'Error al guardar cliente');
      throw err;
    }
  };

  // Eliminar cliente
  const deleteClients = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/api/clients/${id}/`);
      setClients(prev => prev.filter(cliente => cliente.id !== id));
    } catch (err) {
      setError(err.response?.data || 'Error al borrar cliente');
      throw err;
    }
  };

  // Actualizar cliente
  const updateClients = async (id, updatedClient) => {
    try {
      const res = await axios.put(`http://localhost:8000/api/clients/${id}/`, updatedClient);
      setClients(prev =>
        prev.map((cliente) => (cliente.id === id ? res.data : cliente))
      );
      return res.data;
    } catch (err) {
      setError(err.response?.data || 'Error al actualizar cliente');
      throw err;
    }
  };

  // Buscar desde backend con ?q=
  const fetchClientsFromBackend = async (term) => {
    if (!term.trim()) {
      setFilteredClients([]);
      return;
    }

    setLoadingSearch(true);
    try {
      const res = await axios.get(`http://localhost:8000/api/clients/?q=${encodeURIComponent(term)}`);
      setFilteredClients(res.data); // ✅ Recibimos resultados del backend
    } catch (err) {
      console.error("Error al buscar clientes", err);
      setFilteredClients([]); // ❌ Si hay error, no mostramos nada
    } finally {
      setLoadingSearch(false);
    }
  };

  // Manejar Enter o Blur
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      fetchClientsFromBackend(e.target.value);
    }
  };

  const handleBlur = () => {
    if (searchClient.trim().length >= 2) {
      fetchClientsFromBackend(searchClient);
    }
  };

  // Cargar datos iniciales
  useEffect(() => {
    cargarClientes();
  }, []);

  // Filtrar cuando cambia el término de búsqueda
  useEffect(() => {
    if (searchClient.trim().length >= 2) {
      fetchClientsFromBackend(searchClient);
    } else {
      setFilteredClients([]); // Limpiar resultados si escribe menos de 2 caracteres
    }
  }, [searchClient]);

  // Valor compartido a través del contexto
  const value = {
    clients,
    loading,
    error,

    // Estados de búsqueda
    searchClient,
    setSearchClient,
    filteredClients,
    setFilteredClients,
    loadingSearch,

    // Funciones
    refetchclientes: cargarClientes,
    addClients,
    deleteClients,
    updateClients,
    fetchClientsFromBackend,
    handleKeyDown,
    handleBlur,
  };

  return (
    <ClientsContext.Provider value={value}>
      {!loading ? children : <div>Cargando datos...</div>}
    </ClientsContext.Provider>
  );
};