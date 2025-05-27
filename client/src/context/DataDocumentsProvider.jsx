// src/context/ApiContext.jsx

import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

// 1. Creamos el Contexto
const DataDocumentsContext = createContext();

// 2. Creamos un hook para usar el contexto
export const useApiDataDocumentsContext = () => {
  const context = useContext(DataDocumentsContext);
  if (!context) {
    throw new Error('useApiDataDataDocumentsContext debe usarse dentro de DataDocumentsProvider');
  }
  return context;
};

// 3. El Provider que carga los datos
export const DataDocumentsProvider = ({ children }) => {
  const [datadocuments, setDatadocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cargar datadocuments desde la API
  const cargarDatadocuments = async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/datadocuments/');
      setDatadocuments(res.data);      
    } catch (err) {
      setError(err);
    }
  };

  // Cargar datos al inicio
  useEffect(() => {
    cargarDatadocuments().then(() => setLoading(false));
  }, []);

  const value = {
    datadocuments,
    loading,
    error,
    refetchdatadocuments: cargarDatadocuments,
  };

  return (
    <DataDocumentsContext.Provider value={value}>
      {!loading ? children : <div>Cargando datos...</div>}
    </DataDocumentsContext.Provider>
  );
};