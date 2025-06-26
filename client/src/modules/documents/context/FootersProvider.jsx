// src/context/ApiContext.jsx

import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

// Configuración global
const API_URL = "http://localhost:8000/api/footers/";

// 1. Creamos el Contexto
const FootersContext = createContext();

// 2. Creamos un hook para usar el contexto
export const useApiFootersContext = () => {
  const context = useContext(FootersContext);
  if (!context) {
    throw new Error(
      "useApiDataFootersContext debe usarse dentro de FootersProvider"
    );
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
      const res = await axios.get(API_URL);
      setFooters(res.data);
    } catch (err) {
      setError(err);
    }
  };

  // Cargar footers a partir de un ID
  const loadFooterPorId = async (id) => {
    try {
      const res = await axios.get(`${API_URL}${id}/`);
      setFooters([res.data]); // Actualizamos el estado con el footer encontrado
    } catch (err) {
      setError(err);
    }
  };

  // Guardar un nuevo footer
  const saveFooter = async (nuevoFooter) => {
    // console.log("Nuevo footer a guardar:", nuevoFooter);

    // Validación inicial
    if (
      !nuevoFooter ||
      typeof nuevoFooter !== "object" ||
      Object.keys(nuevoFooter).length === 0
    ) {
      console.warn("Datos inválidos para guardar footer", nuevoFooter);
      throw new Error("Datos inválidos para guardar footer");
    }

    try {
      const res = await axios.post(API_URL, nuevoFooter);
      // console.log("Respuesta del servidor:", res.data);

      // Actualizar estado local
      setFooters((prev) => [...prev, res.data]);

      return res.data;
    } catch (err) {
      const errorMsg =
        err.response?.data?.detail || err.message || "Error desconocido";
      console.error("Error al guardar el footer:", errorMsg);
      setError(errorMsg);
      throw new Error(`No se pudo guardar el footer: ${errorMsg}`);
    }
  };

  // Actualizar un footer existente
  const updateFooter = async (id, datosActualizados) => {
    try {
      const res = await axios.put(`${API_URL}${id}/`, datosActualizados);
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
      const res = await axios.get(
        `http://localhost:8000/api/footers/?footer_documento=${id}`
      );
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
    getFootersByFieldId,
  };

  return (
    <FootersContext.Provider value={value}>
      {!loading ? children : <div>Cargando datos...</div>}
    </FootersContext.Provider>
  );
};
