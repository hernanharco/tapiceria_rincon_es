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
  const [filteredClients, setFilteredClients] = useState([]); // ✅ Nuevo estado para resultados de búsqueda
  const [loading, setLoading] = useState(true);
  const [loadingSearch, setLoadingSearch] = useState(false); // ✅ Nuevo estado para búsqueda
  const [error, setError] = useState(null);

  // Cargar todos los clientes desde Django
  const cargarClientes = async () => {
    try {
      const res = await axios.get(API_URL);
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
      const response = await axios.post(API_URL, newClient);
      setClients((prev) => [...prev, response.data]);
      return response.data;
    } catch (err) {
      setError(err.response?.data || 'Error al guardar cliente');
      throw err;
    }
  };

  // Eliminar cliente
  const deleteClients = async (id) => {
    try {
      await axios.delete(`${API_URL}${id}/`);
      setClients((prev) => prev.filter((cliente) => cliente.id !== id));
    } catch (err) {
      setError(err.response?.data || 'Error al borrar cliente');
      throw err;
    }
  };

  // Actualizar cliente
  const updateClients = async (id, updatedClient) => {
    try {
      const res = await axios.put(`${API_URL}${id}/`, updatedClient);
      setClients((prev) =>
        prev.map((cliente) => (cliente.id === id ? res.data : cliente))
      );
      return res.data;
    } catch (err) {
      setError(err.response?.data || 'Error al actualizar cliente');
      throw err;
    }
  };

  // Función para buscar un cliente por su CIF
  const getClientByCif = async (cif) => {
    try {
      const response = await axios.get(`http://localhost:8000/api/clients/${cif}/`);

      // Retorna los datos del cliente encontrado
      return response.data;

    } catch (err) {
      console.error('Error al buscar el cliente:', err);
      setError('No se pudo encontrar el cliente con CIF: ' + cif);
      return null; // Retorna null si hay error
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
      const res = await axios.get(`${API_URL}?q=${encodeURIComponent(term)}`);
      setFilteredClients(res.data); // ✅ Recibimos resultados del backend
    } catch (err) {
      console.error('Error al buscar clientes', err);
      setFilteredClients([]); // ❌ Si hay error, no mostramos nada
    } finally {
      setLoadingSearch(false);
    }
  };

  // Cargar datos iniciales
  useEffect(() => {
    cargarClientes();
  }, []);

  // Valor compartido a través del contexto
  const value = {
    clients,
    filteredClients, // ✅ Añadimos filteredClients al contexto si quieres usarlo en otros componentes
    loading,
    loadingSearch, // ✅ Opcional: útil si quieres mostrar un spinner mientras se busca
    error,

    // Funciones
    refetchclientes: cargarClientes,
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