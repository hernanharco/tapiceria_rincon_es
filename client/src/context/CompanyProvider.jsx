// src/context/ApiContext.jsx

import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

// 1. Creamos el Contexto
const CompanyContext = createContext();

// 2. Creamos un hook para usar el contexto
export const useApiCompanyContext = () => {
  const context = useContext(CompanyContext);
  if (!context) {
    throw new Error('useApiDataCompanyContext debe usarse dentro de CompanyProvider');
  }
  return context;
};

// 3. El Provider que carga los datos
export const CompanyProvider = ({ children }) => {
  const [empresas, setEmpresas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cargar empresas desde la API
  const cargarEmpresas = async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/companies/');
      setEmpresas(res.data);      
    } catch (err) {
      setError(err);
    }
  };

  // Cargar datos al inicio
  useEffect(() => {
    cargarEmpresas().then(() => setLoading(false));
  }, []);

  const value = {
    empresas,
    loading,
    error,
    refetchEmpresas: cargarEmpresas,
  };

  return (
    <CompanyContext.Provider value={value}>
      {!loading ? children : <div>Cargando datos...</div>}
    </CompanyContext.Provider>
  );
};