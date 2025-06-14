// src/context/ApiContext.jsx

import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

// 1. Creamos el Contexto
const PagosContext = createContext();

// 2. Creamos un hook para usar el contexto
export const useApiPagosContext = () => {
  const context = useContext(PagosContext);
  if (!context) {
    throw new Error('useApiDataPagosContext debe usarse dentro de PagosProvider');
  }
  return context;
};

// 3. El Provider que carga los datos
export const PagosProvider = ({ children }) => {
  const [pagos, setPagos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cargar Pagos desde la API
  const cargarPagos = async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/pagos/');
      setPagos(res.data);      
    } catch (err) {
      setError(err);
    }
  };

  // Cargar datos al inicio
  useEffect(() => {
    cargarPagos().then(() => setLoading(false));
  }, []);

  const value = {
    pagos,
    loading,
    error,
    refetchclientes: cargarPagos,
  };

  return (
    <PagosContext.Provider value={value}>
      {!loading ? children : <div>Cargando datos...</div>}
    </PagosContext.Provider>
  );
};