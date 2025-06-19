// src/context/ApiContext.jsx

import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

// Configuración global
const API_URL = 'http://localhost:8000/api/documents/';

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
      const res = await axios.get(API_URL);
      // console.log('DocumentsProvider. Datos obtenidos:', res.data);
      setDocuments(res.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  // Insertar nuevo Documento
  const addProduct = async (newProduct) => {
    // console.log('DocumentsProvider. Nuevo numero de documento a agregar:', newProduct);
    try {
      const response = await axios.post(API_URL, newProduct);
      setDocuments((prev) => [...prev, response.data]); // Agrega respuesta del servidor
      return response.data;
    } catch (err) {
      const errorData = err.response?.data || {};
      const errorMessage = errorData.detail || JSON.stringify(errorData) || err.message;
      console.error('Error al guardar:', errorMessage);
      throw new Error(`No se pudo guardar el documento: ${errorMessage}`);
    }
  };

  // Eliminar un documento por su ID
  const deleteProduct = async (numFactura) => {
    // console.log('DocumentsProvider. Eliminando documento con numFactura:', numFactura);
    try {
      const response = await axios.delete(`${API_URL}${numFactura}/`);

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
  const getDocumentByDoc = async (doc) => {
    // console.log('DocumentsProvider. Buscando documento por doc:', doc);

    if (!doc || typeof doc !== 'string' || doc.trim() === '') {
      console.warn('Valor inválido para doc:', doc);
      return [];
    }

    try {
      const url = `${API_URL}?dataclient=${doc}`;
      // console.log('Haciendo GET a:', url);

      const response = await axios.get(url);
      // console.log('Respuesta completa:', response);
      // console.log('Datos recibidos:', response.data);
      // console.log('¿Es un array?:', Array.isArray(response.data));

      if (!Array.isArray(response.data)) {
        console.error('El backend no devolvió un array');
        return [];
      }

      return response.data;

    } catch (err) {
      console.error('Error al obtener documentos:', err);
      setError('No se pudo encontrar el cliente con CIF: ' + doc);
      return [];
    }
  };

  // const getNumDocumentId = async (cif) => {
  //   console.log("DocumentsProvider. Buscando ID del documento para CIF:", cif);
  //   try {
  //     const response = await getClientByCif(cif); // Suponiendo que ya tienes esta función
  //     console.log("DocumentsProvider. Respuesta de getClientByCif:", response);
  //     if (response.length === 0) {
  //       console.error("No se encontraron documentos para el cliente.");
  //       return null;
  //     }
  //     return response[response.length - 1].id; // ID del último documento
  //   } catch (error) {
  //     console.error("Error al obtener el ID del documento:", error);
  //     return null;
  //   }
  // };


  // Nueva función: Buscar documento por num_factura
  const getDocumentsByNum = (codClient) => {
    console.log('DocumentsProvider. Buscando documentos por num_factura:', codClient);
    // Validación inicial
    if (!codClient) return [];

    // Asegurarnos de tener codClient como string limpio
    const target = String(codClient).trim().toLowerCase();

    // Filtro seguro: convertimos ambos a string, limpiamos y comparamos    
    return documents.filter(doc => {
      // Verifica que doc.cod_cliente exista y sea convertible a string      
      const docCodCliente = String(doc.num_documents_rel || '').trim().toLowerCase();
      return docCodCliente === target;
    });
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
    getDocumentByDoc,
  };

  return (
    <DocumentsContext.Provider value={value}>
      {!loading ? children : <div>Cargando datos...</div>}
    </DocumentsContext.Provider>
  );
};