import { createContext, useContext, useState, useEffect, useCallback, useMemo, useRef } from "react";
import api from '@/api/config';

const API_URL = "/api/datadocuments/";
const DataDocumentsContext = createContext();

export const useApiDataDocumentsContext = () => {
  const context = useContext(DataDocumentsContext);
  if (!context) {
    throw new Error("useApiDataDataDocumentsContext debe usarse dentro de DataDocumentsProvider");
  }
  return context;
};

export const DataDocumentsProvider = ({ children }) => {
  const [datadocuments, setDatadocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Referencia para controlar el tiempo sin disparar re-renders
  const lastFetchedRef = useRef(0);

  // 1. Cargar datos (Estable, sin bucles)
  const cargarDatadocuments = useCallback(async (silent = false) => {
    const ahora = Date.now();
    
    // Si es carga silenciosa y pasaron menos de 30s, no hacemos nada
    if (silent && ahora - lastFetchedRef.current < 30000) return;

    // Solo bloqueamos la pantalla si no hay datos previos
    if (!silent && datadocuments.length === 0) setLoading(true);

    try {
      const res = await api.get(API_URL);
      setDatadocuments(res.data);
      lastFetchedRef.current = ahora;
      setError(null);
    } catch (err) {
      console.error("Error al cargar documentos:", err);
      setError("Error al sincronizar documentos.");
    } finally {
      setLoading(false);
    }
  }, [datadocuments.length]); 

  // 2. Insertar (Actualización local inmediata)
  const addProductTable = async (newProduct) => {
    console.log("addProductTable: ", newProduct)
    try {
      const dataToSend= {
        referencia: newProduct.referencia,
        descripcion: newProduct.descripcion,
        cantidad: newProduct.cantidad,
        precio: newProduct.precio,
        dto: newProduct.dto,
        importe: newProduct.importe,
        entrega: "",
        line: true,        
        documento: newProduct.documento,
      }
      const response = await api.post(API_URL, dataToSend);
      setDatadocuments((prev) => [...prev, response.data]);
      return response.data;
    } catch (err) {
      console.error("Error al añadir producto:", err);
      throw err;
    }
  };

  // 3. Borrar (Actualización local inmediata)
  const deleteProduct = async (id) => {
    try {
      await api.delete(`${API_URL}${id}/`);
      setDatadocuments((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error("Error al borrar producto:", err);
      throw err;
    }
  };

  // 4. Actualizar (Usando PATCH para velocidad)
  const updateProductTable = async (id, updatedProduct) => {
    try {
      // Usamos patch para enviar solo lo que cambió
      const res = await api.patch(`${API_URL}${id}/`, updatedProduct);
      setDatadocuments((prev) =>
        prev.map((prod) => (prod.id === id ? res.data : prod))
      );
      return res.data;
    } catch (err) {
      console.error("Error al actualizar tabla:", err);
      throw err;
    }
  };

  // 5. Búsqueda LOCAL (Instantánea)
  // IMPORTANTE: Ya no hace falta ir al servidor, filtramos lo que ya tenemos
  const getDocumentsByNum = useCallback((num_document) => {
    if (!num_document) return [];
    return datadocuments.filter((doc) => doc.documento === num_document);
  }, [datadocuments]);

  // 6. Obtener por ID (Primero mira en local, si no está va a la API)
  const getDocumentByIdFromAPI = useCallback(async (id) => {
    if (!id) return null;
    
    // Intentamos buscarlo primero en nuestro estado local
    const docLocal = datadocuments.find(d => d.id === id);
    if (docLocal) return docLocal;

    try {
      const response = await api.get(`${API_URL}${id}/`);
      return response.data;
    } catch (err) {
      console.error("Error al obtener documento por ID:", err);
      return null;
    }
  }, [datadocuments]);

  // Ejecución inicial segura
  useEffect(() => {
    cargarDatadocuments();
  }, [cargarDatadocuments]);

  const value = useMemo(() => ({
    datadocuments,
    loading,
    error,
    refetchdatadocuments: cargarDatadocuments,
    addProductTable,
    deleteProduct,
    updateProductTable,
    getDocumentsByNum,
    getDocumentByIdFromAPI,    
  }), [datadocuments, loading, error, cargarDatadocuments, getDocumentsByNum, getDocumentByIdFromAPI]);

  return (
    <DataDocumentsContext.Provider value={value}>
      {loading && datadocuments.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-10 bg-white rounded-lg shadow-sm">
           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mb-3"></div>
           <p className="text-sm text-gray-500 italic">Cargando líneas de detalle...</p>
        </div>
      ) : (
        children
      )}
    </DataDocumentsContext.Provider>
  );
};