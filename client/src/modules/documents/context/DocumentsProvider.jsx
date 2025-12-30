import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, useRef } from "react";
import api from "@/api/config";

const API_URL = "/api/documents/";
const DocumentsContext = createContext();

export const useApiDocumentsContext = () => {
  const context = useContext(DocumentsContext);
  if (!context) {
    throw new Error("useApiDocumentsContext debe usarse dentro de DocumentsProvider");
  }
  return context;
};

export const DocumentsProvider = ({ children }) => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Referencia de tiempo para evitar el bucle infinito
  const lastFetchedRef = useRef(0);

  // 1. Cargar documentos (Estable y sin bucles)
  const refetch = useCallback(async (silent = false) => {
    const ahora = Date.now();
    if (silent && ahora - lastFetchedRef.current < 30000) return;

    if (!silent && documents.length === 0) setLoading(true);
    
    try {
      const res = await api.get(API_URL);
      setDocuments(res.data);
      lastFetchedRef.current = ahora;
      setError(null);
    } catch (err) {
      console.error("Error al cargar documentos:", err);
      setError("No se pudieron cargar los documentos");
    } finally {
      setLoading(false);
    }
  }, [documents.length]);

  // 2. Insertar documento
  const addProduct = async (newProduct) => {
    try {
      const response = await api.post(API_URL, newProduct);
      setDocuments((prev) => [...prev, response.data]);
      return response.data;
    } catch (err) {
      console.error("Error al añadir documento:", err);
      throw err;
    }
  };

  // 3. Actualizar documento por ID (PATCH optimizado)
  const updateDocumentFieldsId = async (id, updatedFields) => {
    if (id === undefined) return;
    try {
      const response = await api.patch(`${API_URL}${id}/`, updatedFields);
      setDocuments((prev) =>
        prev.map((doc) => (doc.id === id ? response.data : doc))
      );
      return response.data;
    } catch (err) {
      console.error("Error al actualizar por ID:", err);
      throw err;
    }
  };

  // 4. Eliminar documento
  const deleteProduct = async (numFactura) => {
    try {
      await api.delete(`${API_URL}${numFactura}/`);
      setDocuments((prev) => prev.filter((doc) => doc.num_factura !== numFactura));
    } catch (err) {
      console.error("Error al eliminar documento:", err);
      throw err;
    }
  };

  // --- OPTIMIZACIÓN DE BÚSQUEDAS: TODO LOCAL (0 LATENCIA) ---

  // Buscar por CIF (Local)
  const getDocumentByDoc = useCallback((docCif) => {
    if (!docCif?.trim()) return [];
    const cif = docCif.trim();
    return documents.filter((d) => d.dataclient === cif);
  }, [documents]);

  // Buscar por número de presupuesto (Local)
  const fetchDocumentByNum = useCallback((num_presupuesto) => {
    return documents.find((doc) => doc.num_presupuesto === num_presupuesto) || null;
  }, [documents]);

  // Buscar por Observaciones (Local e Instantáneo)
  const getDocumentsByObservaciones = useCallback((searchText) => {
    if (!searchText?.trim()) return [];
    const text = searchText.trim().toLowerCase();
    return documents.filter((doc) => 
      doc.observaciones && doc.observaciones.toLowerCase().includes(text)
    );
  }, [documents]);

  // 5. Obtener por ID (Híbrido: Local primero, luego API)
  const fetchDocumentById = useCallback(async (id) => {
    const localDoc = documents.find(d => d.id === id);
    if (localDoc) return localDoc;

    try {
      const response = await api.get(`${API_URL}${id}/`);
      return response.data;
    } catch (err) {
      console.error("Error fetchDocumentById:", err);
      return null;
    }
  }, [documents]);

  const clearDocuments = () => setDocuments([]);

  // Efecto de carga inicial seguro
  useEffect(() => {
    refetch();
  }, [refetch]);

  const value = useMemo(() => ({
    documents,
    loading,
    error,
    refetch,
    clearDocuments,
    addProduct,
    deleteProduct,
    fetchDocumentByNum,
    getDocumentByDoc,
    updateDocumentFieldsId,
    fetchDocumentById,
    getDocumentsByObservaciones,
  }), [documents, loading, error, refetch, getDocumentByDoc, getDocumentsByObservaciones, fetchDocumentById, fetchDocumentByNum]);

  return (
    <DocumentsContext.Provider value={value}>
      {loading && documents.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-screen bg-white">
           <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
           <p className="text-gray-500 font-medium">Sincronizando Archivos...</p>
        </div>
      ) : (
        children
      )}
    </DocumentsContext.Provider>
  );
};