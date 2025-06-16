// src/context/ApiContext.jsx

import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

// 1. Creamos el Contexto
const FootersContext = createContext();

// 2. Creamos un hook para usar el contexto
export const useApiFootersContext = () => {
  const context = useContext(FootersContext);
  if (!context) {
    throw new Error('useApiDataFootersContext debe usarse dentro de FootersProvider');
  }
  return context;
};

// 3. El Provider que carga los datos
export const FootersProvider = ({ children }) => {
  const [footers, setFooters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cargar footers desde la API
  const cargarFooters = async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/footers/');
      setFooters(res.data);      
    } catch (err) {
      setError(err);
    }
  };

  // Cargar footers a partir de un ID
  const loadFooterPorId = async (id) => {
    try {
      const res = await axios.get(`http://localhost:8000/api/footers/${id}/`);
      setFooters([res.data]); // Actualizamos el estado con el footer encontrado
    } catch (err) {
      setError(err);
    }
  };

  // Guardar un nuevo footer
  const saveFooter = async (nuevoFooter) => {
    // console.log("Nuevo footer a guardar:", nuevoFooter);
    try {
      const res = await axios.post('http://localhost:8000/api/footers/', nuevoFooter);
      setFooters((prev) => [...prev, res.data]); // Añadimos el nuevo footer a la lista
      return res.data;
    } catch (err) {
      setError(err);
      throw err;
    }
  };

  // Actualizar un footer existente
  const updateFooter = async (id, datosActualizados) => {
    try {
      const res = await axios.put(`http://localhost:8000/api/footers/${id}/`, datosActualizados);
      setFooters((prev) =>
        prev.map((footer) => (footer.id === id ? res.data : footer))
      );
      return res.data;
    } catch (err) {
      setError(err);
      throw err;
    }
  };

   // Nueva función: traer footers donde cliente_id === id
  const getFootersByFieldId = async (id) => {
    // console.log("Cargando footers por ID:", id);
    try {
      const res = await axios.get(`http://localhost:8000/api/footers/?footer_documento=${id}`);
      // console.log("Footers obtenidos por ID:", res.data);
      setFooters(res.data); // Actualizamos el estado con los resultados
      return res.data; // Devolvemos los datos para usarlos en componentes
    } catch (err) {
      setError(err);
      throw err;
    }
  };

  // Cargar datos al inicio
  useEffect(() => {
    cargarFooters().then(() => setLoading(false));
  }, []);

  const value = {
    footers,
    loading,
    error,
    loadFooterPorId,
    refetchclientes: cargarFooters,
    saveFooter,
    updateFooter,
    getFootersByFieldId
  };

  return (
    <FootersContext.Provider value={value}>
      {!loading ? children : <div>Cargando datos...</div>}
    </FootersContext.Provider>
  );
};