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
  const refetch = async () => {
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

  // Eliminar un documento por su ID
  const deleteProduct = async (numFactura) => {
    try {
      const response = await axios.delete(
        `http://localhost:8000/api/documents/${numFactura}/`
      );

      // Eliminar del estado local solo si la petición fue exitosa
      setDocuments((prev) =>
        prev.filter((doc) => doc.num_factura !== numFactura)
      );

      return response.data; // Opcional, útil si devuelves algo del servidor
    } catch (err) {
      throw err;
    }
  };

  // Limpiar documentos
  const clearDocuments = () => {
    setDocuments([]);
  };

  // Cargar datos al inicio
  useEffect(() => {
    refetch();
  }, []);

  // Función para buscar un cliente por su CIF
  const getDocumentByNum = async (num) => {
    try {
      const response = await axios.get(`http://localhost:8000/api/documents/${num}/`);

      // Retorna los datos del cliente encontrado
      return response.data;

    } catch (err) {
      console.error('Error al buscar el cliente:', err);
      setError('No se pudo encontrar el cliente con CIF: ' + cif);
      return null; // Retorna null si hay error
    }
  };


  // Nueva función: Buscar documento por num_factura
  const getDocumentsByNum = (codClient) => {
    // Para debugging: muestra el primer documento y sus tipos    
    if (!codClient) return null;
    const ejemplo = documents[0];
    // console.log("Primer documento:", ejemplo);
    // console.log("Tipo de num_document:", typeof codClient, " - ", codClient);
    // console.log("Tipo de documento.documento:", typeof ejemplo.cod_cliente, " - ", ejemplo.cod_cliente);
    // Filtro seguro: convierte ambos a string y limpia espacios
    return documents.filter(doc => String(doc.cod_cliente).trim().toLowerCase() === String(codClient).trim().toLowerCase());
  };

  const value = {
    documents,
    loading,
    error,
    refetch, // permite recargar manualmente
    clearDocuments,
    addProduct,
    deleteProduct,
    getDocumentsByNum,
    getDocumentByNum,
  };

  return (
    <DocumentsContext.Provider value={value}>
      {!loading ? children : <div>Cargando datos...</div>}
    </DocumentsContext.Provider>
  );
};