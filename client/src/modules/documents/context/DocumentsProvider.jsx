// src/context/ApiContext.jsx

import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

// Configuración global
const API_URL = "http://localhost:8000/api/documents/";

const DocumentsContext = createContext();

export const useApiDocumentsContext = () => {
  const context = useContext(DocumentsContext);
  if (!context) {
    throw new Error(
      "useApiDocumentsContext debe usarse dentro de DocumentsProvider"
    );
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
      setDocuments(res.data);
    } catch {
      setError("No se pudieron cargar los documentos");
    } finally {
      setLoading(false);
    }
  };

  // Obtener todos los documentos
  const getAllDocuments = async () => {
    try {
      const response = await axios.get(API_URL);
      if (!Array.isArray(response.data)) return [];
      return response.data;
    } catch {
      setError("No se pudieron cargar los documentos");
      return [];
    }
  };

  // Insertar nuevo documento
  const addProduct = async (newProduct) => {
    const response = await axios.post(API_URL, newProduct);
    setDocuments((prev) => [...prev, response.data]);
    return response.data;
  };

  // Actualizar documento por ID
  const updateDocumentFieldsId = async (id, updatedFields) => {
    if (id === undefined) return;
    const response = await axios.patch(`${API_URL}${id}/`, updatedFields);
    setDocuments((prev) =>
      prev.map((doc) => (doc.id === id ? response.data : doc))
    );
    return response.data;
  };

  // Eliminar un documento por su num_factura
  const deleteProduct = async (numFactura) => {
    await axios.delete(`${API_URL}${numFactura}/`);
    setDocuments((prev) =>
      prev.filter((doc) => doc.num_factura !== numFactura)
    );
  };

  // Limpiar documentos
  const clearDocuments = () => setDocuments([]);

  // Buscar documentos por CIF
  const getDocumentByDoc = async (doc) => {
    if (!doc || typeof doc !== "string" || doc.trim() === "") return [];
    const cif = doc.trim();
    const url = `${API_URL}?dataclient=${encodeURIComponent(cif)}`;
    const response = await axios.get(url);
    if (!Array.isArray(response.data)) return [];
    return response.data.filter((d) => d.dataclient === cif);
  };

  // Buscar documento por número de presupuesto
  const fetchDocumentByNum = async (num_presupuesto) => {
    const response = await axios.get(API_URL);
    return response.data.find((doc) => doc.num_presupuesto === num_presupuesto) || null;
  };

  // Buscar documento por ID
  const fetchDocumentById = async (id) => {
    try {
      const response = await axios.get(`${API_URL}${id}/`);
      return response.data;
    } catch {
      return null;
    }
  };

  // Actualizar documento por número de presupuesto
  const updateProduct = async (numid, updatedFields) => {
    const existingDoc = await fetchDocumentById(numid);
    if (!existingDoc) throw new Error(`Documento con numid "${numid}" no encontrado.`);
    const response = await axios.patch(`${API_URL}${existingDoc.id}/`, updatedFields);
    setDocuments((prev) =>
      prev.map((doc) => (doc.id === existingDoc.id ? { ...doc, ...response.data } : doc))
    );
    return response.data;
  };

  // Buscar documentos por contenido de observaciones
const getDocumentsByObservaciones = async (searchText) => {
  if (!searchText || typeof searchText !== "string") return [];

  const text = searchText.trim().toLowerCase();

  try {
    const response = await axios.get(API_URL); // traemos todos los documentos
    const filtered = response.data.filter(
      (doc) =>
        doc.observaciones &&
        doc.observaciones.toLowerCase().includes(text)
    );
    return filtered;
  } catch {
    return [];
  }
};


  // Cargar documentos al iniciar
  useEffect(() => {
    refetch();
  }, []);

  const value = {
    documents,
    loading,
    error,
    refetch,
    getAllDocuments,
    clearDocuments,
    addProduct,
    deleteProduct,
    fetchDocumentByNum,
    getDocumentByDoc,
    updateProduct,
    updateDocumentFieldsId,
    fetchDocumentById,
    getDocumentsByObservaciones,
  };

  return (
    <DocumentsContext.Provider value={value}>
      {!loading ? children : <div>Cargando datos...</div>}
    </DocumentsContext.Provider>
  );
};
