// src/context/ApiContext.jsx

import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

// Configuración global
const API_URL = "http://localhost:8000/api/titleDescripcion/";

const TitleTableDocumentsContext = createContext();

export const useApiTitleTableDocumentsContext = () => {
  const context = useContext(TitleTableDocumentsContext);
  if (!context) {
    throw new Error(
      "useApiTitleTableDocumentsContext debe usarse dentro de TitleTableDocumentsProvider"
    );
  }
  return context;
};

export const TitleTableDocumentsProvider = ({ children }) => {
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

  // Nueva función: Obtener todos los documentos
  const getAllDocumentsTitle = async () => {
    try {
      const response = await axios.get(API_URL); // URL base trae todos los documentos

      if (!Array.isArray(response.data)) {
        console.error("El backend no devolvió un array");
        return [];
      }

      return response.data;
    } catch (error) {
      console.error("Error al obtener todos los documentos:", error);
      setError("No se pudieron cargar los documentos");
      return [];
    }
  };

  // Buscar documento por ID
  const fetchDocumentByIdTitle = async (id) => {
    console.log("Find fetchDocumentById", id);
    try {
      const response = await axios.get(`${API_URL}${id}/`);
      return response.data;
    } catch (error) {
      console.error("Error al buscar documento por ID:", error);
      return null;
    }
  };

  // Buscar documento por titledoc  
  const fetchDocumentsByTitleDoc = async (titledoc) => {
    // console.log("Find fetchDocumentBytitledoc", titledoc);
    try {
      const response = await axios.get(`${API_URL}title/?titledocument=${titledoc}`);
      return response.data.results;
    } catch (error) {
      console.error("Error al buscar documento por titledoc:", error);
      return null;
    }
  };

  // Insertar nuevo Documento
  const addProductTitle = async (newProduct) => {
    // console.log('DocumentsProvider. Nuevo numero de documento a agregar:', newProduct);
    try {
      const response = await axios.post(API_URL, newProduct);
      setDocuments((prev) => [...prev, response.data]); // Agrega respuesta del servidor
      return response.data;
    } catch (err) {
      const errorData = err.response?.data || {};
      const errorMessage =
        errorData.detail || JSON.stringify(errorData) || err.message;
      console.error("Error al guardar:", errorMessage);
      throw new Error(`No se pudo guardar el documento: ${errorMessage}`);
    }
  };

  // Actualizar los datos a partir del Id
  const updateDocumentFieldsIdTitle = async (id, updatedFields) => {
    if (id === undefined) return;

    try {
      const response = await axios.patch(`${API_URL}${id}/`, updatedFields);
      setDocuments((prev) =>
        prev.map((doc) => (doc.id === id ? response.data : doc))
      );
      return response.data;
    } catch (err) {
      const message =
        err.response?.data?.detail ||
        err.response?.data?.error ||
        err.message ||
        "Error desconocido";

      console.error(`Error al actualizar documento ${id}:`, message);
      throw new Error(message);
    }
  };

  // Eliminar un documento por su ID
  const deleteProductTitle = async (numFactura) => {
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

  // Buscar documento por id de document (string) valioso para buscar
  const getDocumentsByNumTitle = async (num_document) => {
    // console.log("getDocumentsByNumTitle", num_document);

    try {
      const response = await axios.get(API_URL); // Trae todos los documentos
      const filteredDocuments = response.data.filter(
        (doc) => doc.titledoc === num_document
      );
      return filteredDocuments;
    } catch (error) {
      console.error("Error al buscar documento por num_presupuesto:", error);
      return [];
    }
  };

  // Cargar datos al inicio
  useEffect(() => {
    refetch();
  }, []);

  const value = {
    documents,
    loading,
    error,
    refetch, // permite recargar manualmente
    getAllDocumentsTitle,
    addProductTitle,
    deleteProductTitle,
    updateDocumentFieldsIdTitle,
    fetchDocumentByIdTitle,
    fetchDocumentsByTitleDoc,
    getDocumentsByNumTitle,
  };

  return (
    <TitleTableDocumentsContext.Provider value={value}>
      {!loading ? children : <div>Cargando datos...</div>}
    </TitleTableDocumentsContext.Provider>
  );
};
