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
      // console.log('DocumentsProvider. Datos obtenidos:', res.data);
      setDocuments(res.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  // Nueva función: Obtener todos los documentos
  const getAllDocuments = async () => {
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

  // Insertar nuevo Documento
  const addProduct = async (newProduct) => {
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
  const updateDocumentFieldsId = async (id, updatedFields) => {
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
    // console.log("DocumentsProvider. Buscando documento por doc:", doc);

    // Validación del CIF
    if (!doc || typeof doc !== "string" || doc.trim() === "") {
      console.warn("Valor inválido para doc (CIF):", doc);
      return [];
    }

    const cif = doc.trim(); // Limpiamos espacios en blanco

    try {
      const url = `${API_URL}?dataclient=${encodeURIComponent(cif)}`;
      // console.log("Haciendo GET a:", url);

      const response = await axios.get(url);
      const data = response.data;

      // console.log("Datos recibidos:", data);
      // console.log("¿Es un array?:", Array.isArray(data));

      if (!Array.isArray(data)) {
        console.error("El backend no devolvió un array");
        return [];
      }

      // Si el backend ya filtra correctamente, este filtro adicional puede ser redundante
      // Pero lo dejamos como medida extra:
      const filtered = data.filter((doc) => doc.dataclient === cif);

      // console.log(
      //   `Filtrados ${filtered.length} documentos para el CIF: ${cif}`
      // );
      return filtered;
    } catch (err) {
      console.error("Error al obtener documentos para el CIF:", cif, err);

      if (err.response) {
        console.error("Respuesta del servidor:", err.response.data);
      } else if (err.request) {
        console.error("No hubo respuesta del servidor.");
      } else {
        console.error("Error desconocido:", err.message);
      }

      setError(`No se pudo encontrar documentos para el CIF: ${cif}`);
      return [];
    }
  };

  // Nueva función: Buscar documento num_presupuesto seria PRE250626 valioso para buscar
  const fetchDocumentByNum = async (num_presupuesto) => {
    try {
      const response = await axios.get(API_URL); // Trae todos los documentos
      const filteredDocuments = response.data.filter(
        (doc) => doc.num_presupuesto === num_presupuesto
      );
      return filteredDocuments[0];
    } catch (error) {
      console.error("Error al buscar documento por num_presupuesto:", error);
      return [];
    }
  };

  // Buscar documento por ID
  const fetchDocumentById = async (id) => {
    // console.log("fetchDocumentById", id)
    try {
      const response = await axios.get(`${API_URL}${id}/`);
      return response.data;
    } catch (error) {
      console.error("Error al buscar documento por ID:", error);
      return null;
    }
  };

  // ✨ NUEVA FUNCIÓN: Actualizar documento por número de presupuesto
  const updateProduct = async (numid, updatedFields) => {
    // console.log("updateProduct DocumentsProvider: ", numid, " datos actualizar:", updatedFields);
    try {
      // Buscar el documento completo por su número
      const existingDoc = await fetchDocumentById(numid);
      // console.log("existingDoc", existingDoc);
      if (!existingDoc) {
        throw new Error(`Documento con numid "${numid}" no encontrado.`);
      }

      // Hacer PATCH solo con los campos modificados
      // console.log("URL: ", `${API_URL}${existingDoc.id}/`, updatedFields);
      const response = await axios.patch(
        `${API_URL}${existingDoc.id}/`,
        updatedFields
      );

      // Actualizar en el estado local
      setDocuments((prev) =>
        prev.map((doc) =>
          doc.id === existingDoc.id ? { ...doc, ...response.data } : doc
        )
      );

      return response.data;
    } catch (error) {
      console.error("Error al actualizar documento:", error);
      throw error;
    }
  };

  const value = {
    documents,
    loading,
    error,
    refetch, // permite recargar manualmente
    getAllDocuments,
    clearDocuments,
    addProduct,
    deleteProduct,
    fetchDocumentByNum,
    getDocumentByDoc,
    updateProduct,
    updateDocumentFieldsId,
    fetchDocumentById,
  };

  return (
    <DocumentsContext.Provider value={value}>
      {!loading ? children : <div>Cargando datos...</div>}
    </DocumentsContext.Provider>
  );
};
