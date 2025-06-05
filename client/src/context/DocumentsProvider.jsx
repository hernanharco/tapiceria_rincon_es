// src/context/ApiContext.jsx

import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const DocumentsContext = createContext();

export const useApiDocumentsContext = () => {
  const context = useContext(DocumentsContext);
  if (!context) {
    throw new Error('useApiDocumentsContext debe usarse dentro de DocumentsProvider');
  }
  return context;
};

export const DocumentsProvider = ({ children }) => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cargar documentos desde la API
  const cargarDocuments = async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/documents/');
      setDocuments(res.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  // Insertar nuevo Documento
  const addProduct = async (newProduct) => {    
    // console.log('DocumentsProvider. Nuevo numero de documento a agregar:', newProduct); mnhu5t6y 6y78
    try {
      const response = await axios.post('http://localhost:8000/api/documents/', newProduct);
      setDocuments((prev) => [...prev, response.data]); // Agrega respuesta del servidor
      return response.data;
    } catch (err) {
      setError(err);
      throw err;
    }
  };

  // Limpiar documentos
  const clearDocuments = () => {
    setDocuments([]);
  };

  // Cargar datos al inicio
  useEffect(() => {
    cargarDocuments();
  }, []);

  // // Sondeo periódico (cada 10 segundos)
  // useEffect(() => {
  //   const intervalId = setInterval(() => {
  //     cargarDocuments();
  //   }, 10000); // cada 10 segundos

  //   return () => clearInterval(intervalId); // limpiar al desmontar
  // }, []);

  const value = {
    documents,
    loading,
    error,
    refetch: cargarDocuments, // permite recargar manualmente
    clearDocuments,
    addProduct,
  };

  return (
    <DocumentsContext.Provider value={value}>
      {!loading ? children : <div>Cargando datos...</div>}
    </DocumentsContext.Provider>
  );
};