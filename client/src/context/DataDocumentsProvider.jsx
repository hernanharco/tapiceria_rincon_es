// src/context/ApiContext.jsx

import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

// 1. Creamos el Contexto
const DataDocumentsContext = createContext();

// 2. Creamos un hook para usar el contexto
export const useApiDataDocumentsContext = () => {
  const context = useContext(DataDocumentsContext);
  if (!context) {
    throw new Error('useApiDataDataDocumentsContext debe usarse dentro de DataDocumentsProvider');
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
      const res = await axios.get('http://localhost:8000/api/datadocuments/');
      setDatadocuments(res.data);
    } catch (err) {
      setError(err);
    }
  };

  // Insertar nuevo producto
  const addProduct = async (newProduct) => {
    console.log('DataDocumentsProvider. Nuevo producto a agregar:', newProduct);
    try {
      const response = await axios.post('http://localhost:8000/api/datadocuments/', newProduct);
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
      setDatadocuments((prev) => prev.filter(producto => producto.id !== id));
    } catch (err) {
      setError(err);
      throw err;
    }
  };

  // Para actualizar un producto
  const updateProduct = async (id, updatedProduct) => {
    try {
      console.log('DataDocumentsProvider. Actualizando producto con ID:', id, 'Datos:', updatedProduct);
      const res = await axios.put(`http://localhost:8000/api/datadocuments/${id}/`, updatedProduct);
      setDatadocuments((prev) =>
        prev.map((prod) => (prod.id === id ? res.data : prod))
      );
      return res.data;
    } catch (err) {
      setError(err);
      throw err;
    }
  };

  // Cargar datos al inicio
  useEffect(() => {
    cargarDatadocuments().then(() => setLoading(false));
  }, []);

  const value = {
    datadocuments,
    loading,
    error,
    refetchdatadocuments: cargarDatadocuments,
    addProduct, // ✅ Exponemos esta función para usarla en el modal
    deleteProduct, // Exponemos la función para borrar productos
    updateProduct // Exponemos la función para actualizar productos
  };

  return (
    <DataDocumentsContext.Provider value={value}>
      {!loading ? children : <div>Cargando datos...</div>}
    </DataDocumentsContext.Provider>
  );
};