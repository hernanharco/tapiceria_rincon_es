// src/context/ApiContext.jsx

import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

// 1. Creamos el Contexto
const FootersContext = createContext();

// 2. Creamos un hook para usar el contexto
export const useApiFootersContext = () => {
  const context = useContext(FootersContext);
  if (!context) {
    throw new Error('useApiDataFootersContext debe usarse dentro de FootersProvider');
  }
  return context;
};

// 3. El Provider que carga los datos
export const FootersProvider = ({ children }) => {
  const [footers, setFooters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cargar footers desde la API
  const cargarFooters = async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/footers/');
      setFooters(res.data);      
    } catch (err) {
      setError(err);
    }
  };

  // Cargar datos al inicio
  useEffect(() => {
    cargarFooters().then(() => setLoading(false));
  }, []);

  const value = {
    footers,
    loading,
    error,
    refetchclientes: cargarFooters,
  };

  return (
    <FootersContext.Provider value={value}>
      {!loading ? children : <div>Cargando datos...</div>}
    </FootersContext.Provider>
  );
};