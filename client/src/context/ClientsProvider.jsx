// src/context/ApiContext.jsx

import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

// 1. Creamos el Contexto
const ClientsContext = createContext();

// 2. Creamos un hook para usar el contexto
export const useApiClientsContext = () => {
  const context = useContext(ClientsContext);
  if (!context) {
    throw new Error('useApiDataClientsContext debe usarse dentro de DataClientsProvider');
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

  // Cargar datos al inicio
  useEffect(() => {
    cargarClientes().then(() => setLoading(false));
  }, []);

  const value = {
    clientes,
    loading,
    error,
    refetchclientes: cargarClientes,
  };

  return (
    <ClientsContext.Provider value={value}>
      {!loading ? children : <div>Cargando datos...</div>}
    </ClientsContext.Provider>
  );
};

export {  }