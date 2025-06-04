// src/context/ApiContext.jsx

import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

// 1. Creamos el Contexto
const DocumentsContext = createContext();

// 2. Creamos un hook para usar el contexto
export const useApiDocumentsContext = () => {
  const context = useContext(DocumentsContext);
  if (!context) {
    throw new Error('useApiDataDocumentsContext debe usarse dentro de DocumentsProvider');
  }
  return context;
};

// 3. El Provider que carga los datos
export const DocumentsProvider = ({ children }) => {
  const [documents, setDocumentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cargar documentos desde la API
  const cargarDocuments = async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/documents/');
      setDocumentos(res.data);      
    } catch (err) {
      setError(err);
    }
  };

  // Cargar datos al inicio
  useEffect(() => {
    cargarDocuments().then(() => setLoading(false));
  }, []);

  const value = {
    documents,
    loading,
    error,
    refetchclientes: cargarDocuments,
  };

  return (
    <DocumentsContext.Provider value={value}>
      {!loading ? children : <div>Cargando datos...</div>}
    </DocumentsContext.Provider>
  );
};