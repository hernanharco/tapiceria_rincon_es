// src/context/ApiContext.jsx

import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

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
      const res = await axios.get("http://localhost:8000/api/datadocuments/");
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
      const response = await axios.post(
        "http://localhost:8000/api/datadocuments/", newProduct
      );
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
      await axios.delete(`http://localhost:8000/api/datadocuments/${id}/`);
      setDatadocuments((prev) => prev.filter((producto) => producto.id !== id));
    } catch (err) {
      setError(err);
      throw err;
    }
  };

  // Para actualizar un producto
  const updateProduct = async (id, updatedProduct) => {
    try {
      console.log(
        "DataDocumentsProvider. Actualizando producto con ID:",
        id,
        "Datos:",
        updatedProduct
      );
      const res = await axios.put(
        `http://localhost:8000/api/datadocuments/${id}/`,
        updatedProduct
      );
      setDatadocuments((prev) =>
        prev.map((prod) => (prod.id === id ? res.data : prod))
      );
      return res.data;
    } catch (err) {
      setError(err);
      throw err;
    }
  };

  // Nueva función: Buscar documento por num_factura
  const getDocumentsByNum = (num_document) => {
    // Para debugging: muestra el primer documento y sus tipos
    if (!num_document) return null;
    // const ejemplo = datadocuments[0];
    // console.log("Primer documento:", ejemplo);
    // console.log("Tipo de num_document:", typeof num_document);
    // console.log("Tipo de documento.documento:", typeof ejemplo.documento);
    // Filtro seguro: convierte ambos a string y limpia espacios
    return datadocuments.filter(
      (doc) =>
        String(doc.documento).trim().toLowerCase() ===
        String(num_document).trim().toLowerCase()
    );
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
    updateProduct, // Exponemos la función para actualizar productos
    getDocumentsByNum,
  };

  return (
    <DataDocumentsContext.Provider value={value}>
      {!loading ? children : <div>Cargando datos...</div>}
    </DataDocumentsContext.Provider>
  );
};
