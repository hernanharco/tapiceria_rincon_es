// src/context/ApiContext.jsx

import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

// Configuración global
const API_URL = "http://localhost:8000/api/datadocuments/";

// 1. Creamos el Contexto
const DataDocumentsContext = createContext();

// 2. Creamos un hook para usar el contexto
export const useApiDataDocumentsContext = () => {
  const context = useContext(DataDocumentsContext);
  if (!context) {
    throw new Error(
      "useApiDataDataDocumentsContext debe usarse dentro de DataDocumentsProvider"
    );
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
      const res = await axios.get(API_URL);
      setDatadocuments(res.data);
    } catch (err) {
      console.error("Error al cargar documentos:", err); // 👈 Muestra detalles del error
      setError(err);
    }
  };

  // Insertar nuevo producto
  const addProductTable = async (newProduct) => {
    // console.log('DataDocumentsProvider. Nuevo producto a agregar:', newProduct);
    try {
      const response = await axios.post(API_URL, newProduct);
      setDatadocuments((prev) => [...prev, response.data]); // Agrega respuesta del servidor
      return response.data;
    } catch (err) {
      setError(err);
      throw err;
    }
  };

  // Para borrar un producto
  const deleteProduct = async (id) => {
    try {
      await axios.delete(`${API_URL}${id}/`);
      setDatadocuments((prev) => prev.filter((producto) => producto.id !== id));
    } catch (err) {
      setError(err);
      throw err;
    }
  };

  // Para actualizar un producto
  const updateProductTable = async (id, updatedProduct) => {
    try {
      // console.log("DataDocumentsProvider. Actualizando producto con ID:", id, "Datos:", updatedProduct);
      const res = await axios.put(`${API_URL}${id}/`, updatedProduct);
      setDatadocuments((prev) =>
        prev.map((prod) => (prod.id === id ? res.data : prod))
      );
      return res.data;
    } catch (err) {
      setError(err);
      throw err;
    }
  };

  // Buscar documento por id de document (string) valioso para buscar 
  const getDocumentsByNum = async (num_document) => {
    // console.log("getDocumentsByNum", num_document);  
    
    try {
      const response = await axios.get(API_URL); // Trae todos los documentos
      const filteredDocuments = response.data.filter(
        (doc) => doc.documento === num_document
      );
      return filteredDocuments;
    } catch (error) {
      console.error("Error al buscar documento por num_presupuesto:", error);
      return [];
    }
    
  };

  // Buscar documento por ID (entero o string)
  const getDocumentByIdFromAPI = async (id) => {
    // console.log("getDocumentByIdFromAPI", id)
    if (!id) return null;
    try {
      const response = await axios.get(`${API_URL}${id}/`);
      console.log("response id: ", response)
      return response.data; // Devuelve el documento encontrado
    } catch (err) {
      console.error("Error al obtener documento por ID desde la API:", err);
      return null;
    }
  };  

  // Cargar datos al inicio
  useEffect(() => {
    cargarDatadocuments().then(() => {
      setLoading(false);
    });
  }, []);

  const value = {
    datadocuments,
    loading,
    error,
    refetchdatadocuments: cargarDatadocuments,
    addProductTable, // ✅ Exponemos esta función para usarla en el modal
    deleteProduct, // Exponemos la función para borrar productos
    updateProductTable, // Exponemos la función para actualizar productos
    getDocumentsByNum,
    getDocumentByIdFromAPI,    
  };

  return (
    <DataDocumentsContext.Provider value={value}>
      {!loading ? children : <div>Cargando datos...</div>}
    </DataDocumentsContext.Provider>
  );
};
