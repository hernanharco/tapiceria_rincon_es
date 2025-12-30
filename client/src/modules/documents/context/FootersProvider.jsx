import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, useRef } from "react";
import api from "@/api/config";

const API_URL = "/api/footers/";
const FootersContext = createContext();

export const useApiFootersContext = () => {
  const context = useContext(FootersContext);
  if (!context) {
    throw new Error("useApiDataFootersContext debe usarse dentro de FootersProvider");
  }
  return context;
};

export const FootersProvider = ({ children }) => {
  const [footers, setFooters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Blindaje contra bucles infinitos
  const lastFetchedRef = useRef(0);

  // 1. Cargar footers (Estable y seguro)
  const cargarFooters = useCallback(async (silent = false) => {
    const ahora = Date.now();
    if (silent && ahora - lastFetchedRef.current < 30000) return;

    if (!silent && footers.length === 0) setLoading(true);

    try {
      const res = await api.get(API_URL);
      setFooters(res.data);
      lastFetchedRef.current = ahora;
      setError(null);
    } catch (err) {
      console.error("Error al cargar footers:", err);
      setError("Error de red al cargar pies de página.");
    } finally {
      setLoading(false);
    }
  }, [footers.length]);

  // 2. Guardar nuevo footer
  const saveFooter = async (nuevoFooter) => {
    if (!nuevoFooter || typeof nuevoFooter !== "object") {
      throw new Error("Datos inválidos para guardar footer");
    }

    try {
      const res = await api.post(API_URL, nuevoFooter);
      setFooters((prev) => [...prev, res.data]);
      return res.data;
    } catch (err) {
      console.error("Error al guardar el footer:", err);
      throw err;
    }
  };

  // 3. Búsqueda LOCAL (Cero latencia con Frankfurt)
  const fetchFooterByNum = useCallback((documentoId) => {
    if (!documentoId) return null;
    return footers.find((f) => f.footer_documento === documentoId) || null;
  }, [footers]);

  // 4. Actualizar o Crear (Lógica inteligente)
  const updateFooter = async (footerDocumentoId, datosActualizados) => {
    if (!footerDocumentoId) throw new Error("ID requerido");

    try {
      // Buscamos primero en nuestro estado local (memoria)
      const footerExistente = fetchFooterByNum(footerDocumentoId);

      if (!footerExistente) {
        // Si no está en memoria, lo creamos
        return await saveFooter({
          ...datosActualizados,
          footer_documento: footerDocumentoId,
        });
      }

      // Si existe, enviamos solo los cambios por PATCH
      const res = await api.patch(`${API_URL}${footerExistente.id}/`, datosActualizados);
      
      setFooters((prev) =>
        prev.map((f) => (f.id === footerExistente.id ? res.data : f))
      );

      return res.data;
    } catch (err) {
      console.error("Error en updateFooter:", err);
      throw err;
    }
  };

  // 5. Traer footer por ID de documento (Local)
  const getFootersByFieldId = useCallback((id) => {
    return footers.find((doc) => doc.footer_documento === id) || null;
  }, [footers]);

  // 6. Carga por ID desde API (Híbrido)
  const loadFooterPorId = useCallback(async (id) => {
    try {
      const res = await api.get(`${API_URL}${id}/`);
      setFooters((prev) => {
        const existe = prev.find(f => f.id === res.data.id);
        if (existe) return prev.map(f => f.id === res.data.id ? res.data : f);
        return [...prev, res.data];
      });
    } catch (err) {
      console.error("Error loadFooterPorId:", err);
    }
  }, []);

  useEffect(() => {
    cargarFooters();
  }, [cargarFooters]);

  const value = useMemo(() => ({
    footers,
    loading,
    error,
    loadFooterPorId,
    refetchclientes: cargarFooters,
    saveFooter,
    updateFooter,
    getFootersByFieldId,
    fetchFooterByNum,
  }), [footers, loading, error, cargarFooters, loadFooterPorId, getFootersByFieldId, fetchFooterByNum]);

  return (
    <FootersContext.Provider value={value}>
      {loading && footers.length === 0 ? (
        <div className="flex justify-center p-4">
          <div className="animate-pulse text-gray-400 italic text-sm">Sincronizando totales...</div>
        </div>
      ) : (
        children
      )}
    </FootersContext.Provider>
  );
};