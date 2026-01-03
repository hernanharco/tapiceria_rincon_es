import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";
import api from "@/api/config";

const API_URL = "/api/titleDescripcion/";
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

  // Marca de tiempo para evitar saturación Frankfurt-España
  const lastFetchedRef = useRef(0);

  // 1. Cargar documentos (Blindado contra bucles)
  const refetch = useCallback(async (silent = false) => {
    const ahora = Date.now();
    // Si se cargó hace menos de 30s y es "silent", no viajamos a Alemania
    if (silent && ahora - lastFetchedRef.current < 30000) return;

    // Solo mostramos el spinner si la lista está realmente vacía
    if (!silent && documents.length === 0) setLoading(true);

    try {
      const res = await api.get(API_URL);
      const data = Array.isArray(res.data) ? res.data : res.data.results || [];
      setDocuments(data);
      lastFetchedRef.current = ahora;
      setError(null);
    } catch (err) {
      console.error("Error al cargar títulos:", err);
      setError("Error de conexión con el servidor.");
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Cero dependencias para romper el bucle infinito

  // 2. Búsqueda por ID (Híbrida: Local primero)
  const fetchDocumentByIdTitle = useCallback(
    async (id) => {
      if (!id) return null;
      const local = documents.find((d) => d.id === id);
      if (local) return local;

      try {
        const response = await api.get(`${API_URL}${id}/`);
        return response.data;
      } catch (err) {
        console.error("Error al buscar por ID:", err);
        return null;
      }
    },
    [documents]
  );

  // 3. Búsqueda por número de documento (LOCAL - Instantánea)
  const getDocumentsByNumTitle = useCallback(
    (num_document) => {
      if (!num_document) return [];
      // Priorizamos la velocidad local sobre la consulta al backend
      return documents.filter((doc) => doc.titledoc === num_document);
    },
    [documents]
  );

  // 4. CRUD con actualización inmediata del estado
  const addProductTitle = async (newProduct) => {
    console.log("newProduct: ", newProduct);
    try {
      const response = await api.post(API_URL, newProduct);
      console.log("api.post:")
      console.log("response: ", response);
      setDocuments((prev) => [...prev, response.data]);
      return response.data;
    } catch (err) {
      console.error("Error al guardar título:", err);
      throw new Error(err.response?.data?.detail || "Error al guardar");
    }
  };

  const updateDocumentFieldsIdTitle = async (id, updatedFields) => {
    console.log("id: ", id,  "updateFields: ", updatedFields)
    if (!id) return;
    try {
      const response = await api.patch(`${API_URL}${id}/`, updatedFields);
      setDocuments((prev) =>
        prev.map((doc) => (doc.id === id ? response.data : doc))
      );
      return response.data;
    } catch (err) {
      console.error("Error al actualizar título:", err);
      throw err;
    }
  };

  const deleteProductTitle = async (id) => {
    try {
      await api.delete(`${API_URL}${id}/`);
      setDocuments((prev) => prev.filter((doc) => doc.id !== id));
      return true;
    } catch (err) {
      console.error("Error al eliminar título:", err);
      throw err;
    }
  };

  // Efecto inicial seguro
  useEffect(() => {
    refetch();
  }, [refetch]);

  const value = useMemo(
    () => ({
      documents,
      loading,
      error,
      refetch,
      addProductTitle,
      deleteProductTitle,
      updateDocumentFieldsIdTitle,
      fetchDocumentByIdTitle,
      // 💡 Añadimos este alias:
      fetchDocumentsByTitleDoc: getDocumentsByNumTitle,
      getDocumentsByNumTitle,
    }),
    [
      documents,
      loading,
      error,
      refetch,
      fetchDocumentByIdTitle,
      getDocumentsByNumTitle,
    ]
  );

  return (
    <TitleTableDocumentsContext.Provider value={value}>
      {loading && documents.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-48">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-3"></div>
          <p className="text-gray-500 italic">Sincronizando descripciones...</p>
        </div>
      ) : (
        children
      )}
    </TitleTableDocumentsContext.Provider>
  );
};
