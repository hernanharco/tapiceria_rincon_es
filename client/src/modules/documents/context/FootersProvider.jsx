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

  // Nueva función: Buscar por footer_documento
  const fetchFooterByNum = async (num_presupuesto) => {
    // console.log("fetchFooterByNum", num_presupuesto);
    try {
      const response = await axios.get(API_URL); // Trae todos los documentos
      const filteredDocuments = response.data.filter(
        (doc) => doc.footer_documento === num_presupuesto
      );
      return filteredDocuments[0];
    } catch (error) {
      console.error("Error al buscar documento por footer_documento:", error);
      return [];
    }
  };

  // Actualizar un footer existente basado en el campo footer_documento
  const updateFooter = async (footerDocumentoId, datosActualizados) => {
    // console.log(
    //   "Datos recibidos en updateFooter",
    //   footerDocumentoId,
    //   datosActualizados
    // );

    if (!footerDocumentoId) {
      throw new Error(
        "El ID del documento es requerido para actualizar el footer"
      );
    }

    try {
      // Buscar el footer usando el ID del documento
      const footerExistente = await fetchFooterByNum(footerDocumentoId);

      if (!footerExistente) {
        throw new Error(
          `No se encontró ningún footer para el documento ID: ${footerDocumentoId}`
        );
      }

      // Hacer PATCH al endpoint con el ID del footer
      const res = await axios.patch(
        `${API_URL}${footerExistente.id}/`,
        datosActualizados
      );

      // Actualizar estado local
      setFooters((prev) =>
        prev.map((footer) =>
          footer.id === footerExistente.id ? res.data : footer
        )
      );

      return res.data;
    } catch (err) {
      const errorMsg =
        err.response?.data?.detail || err.message || "Error desconocido";
      console.error("Error al actualizar el footer:", errorMsg);
      setError(errorMsg);
      throw new Error(`No se pudo actualizar el footer: ${errorMsg}`);
    }
  };

  // Nueva función: traer footers donde cliente_id === id
  const getFootersByFieldId = async (id) => {
    //console.log("Cargando footers por ID:", id);
    try {
      const response = await axios.get(API_URL); // Trae todos los documentos
      const filteredDocuments = response.data.filter(
        (doc) => doc.footer_documento === id
      );
      return filteredDocuments[0];
    } catch (error) {
      console.error("Error al buscar documento por footer_documento:", error);
      return [];
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
