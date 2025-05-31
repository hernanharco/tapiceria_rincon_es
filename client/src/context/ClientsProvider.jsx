// src/context/ApiContext.jsx

import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

// 1. Creamos el Contexto
const ClientsContext = createContext();

// 2. Creamos un hook para usar el contexto
export const useApiClientsContext = () => {
  const context = useContext(ClientsContext);
  if (!context) {
    throw new Error('useApiDataClientsContext debe usarse dentro de ClientsProvider');
  }
  return context;
};

// 3. El Provider que carga los datos
export const ClientsProvider = ({ children }) => {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cargar clientes desde la API
  const cargarClientes = async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/clients/');
      setClientes(res.data);
    } catch (err) {
      setError(err);
    }
  };

  // Insertar nuevo Cliente
  const addClients = async (newClients) => {    
    try {
      const response = await axios.post('http://localhost:8000/api/clients/', newClients);
      setClientes((prev) => [...prev, response.data]); // Agrega respuesta del servidor
      return response.data;
    } catch (err) {
      setError(err);
      throw err;
    }
  };

  // Para borrar un Cliente
  const deleteClients = async (id) => {    
  try {
    await axios.delete(`http://localhost:8000/api/clients/${id}/`);
    setClientes((prev) => prev.filter(clientes => clientes.id !== id));
  } catch (err) {
    setError(err);
    throw err;
  }
};

// Para actualizar un Cliente
const updateClients = async (id, updatedClients) => {
  console.log('DataDocumentsProvider. Actualizando Cliente con ID:', id, 'Datos:', updatedClients);
  try {    
    const res = await axios.put(`http://localhost:8000/api/clients/${id}/`, updatedClients);
    setClientes((prev) =>
      prev.map((prod) => (prod.id === id ? res.data : prod))
    );
    return res.data;
  } catch (err) {
    setError(err);
    throw err;
  }
};

  // Cargar datos al inicio
  useEffect(() => {
    cargarClientes().then(() => setLoading(false));
  }, []);

  const value = {
    clientes,
    loading,
    error,
    refetchclientes: cargarClientes,
    addClients,
    deleteClients,
    updateClients
  };

  return (
    <ClientsContext.Provider value={value}>
      {!loading ? children : <div>Cargando datos...</div>}
    </ClientsContext.Provider>
  );
};