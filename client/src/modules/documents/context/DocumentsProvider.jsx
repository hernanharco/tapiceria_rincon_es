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
import dayjs from "dayjs"; // <-- CORRECCIÓN: Importación faltante

const API_URL = "/api/documents/";
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

  // Referencia de tiempo para evitar el bucle infinito
  const lastFetchedRef = useRef(0);

  // 1. Cargar documentos (Estable y sin bucles)
  const refetch = useCallback(
    async (silent = false) => {
      const ahora = Date.now();
      // Si es una petición silenciosa y han pasado menos de 30 segundos, ignoramos
      if (silent && ahora - lastFetchedRef.current < 30000) return;

      if (!silent && documents.length === 0) setLoading(true);

      try {
        const res = await api.get(API_URL);
        setDocuments(res.data);
        lastFetchedRef.current = ahora;
        setError(null);
      } catch (err) {
        console.error("Error al cargar documentos:", err);
        setError("No se pudieron cargar los documentos");
      } finally {
        setLoading(false);
      }
    },
    [documents.length]
  );

  // 2. Insertar documento
  const addProduct = async (newDocument) => {    
    try {
      const dataToSend = {
        // Asegúrate de que los nombres coincidan exactamente con el models.py
        dataclient: newDocument.dataclient, // Debe ser el CIF exacto
        fecha_factura: dayjs(newDocument.fecha_factura).format("YYYY-MM-DD"),
        num_presupuesto: String(newDocument.num_presupuesto),
        observaciones: newDocument.observaciones || "",
        // Si el servidor falla aquí, es por el CIF o porque falta el Footer/Lineas en el serializador
      };      

      const response = await api.post(API_URL, dataToSend);
      setDocuments((prev) => [...prev, response.data]);
      return response.data;
    } catch (err) {
      // ESTO ES CLAVE: Mira la pestaña "Network" de tu navegador.
      // Si la respuesta es HTML, el error está en el servidor (Base de datos o Código Python).
      console.error("Error detallado del servidor:", err.response?.data);
      throw err;
    }
  };

  // 3. Actualizar documento por ID (PATCH)
  const updateDocumentFieldsId = async (id, updatedFields) => {
    if (id === undefined) return;
    try {
      const response = await api.patch(`${API_URL}${id}/`, updatedFields);
      setDocuments((prev) =>
        prev.map((doc) => (doc.id === id ? response.data : doc))
      );
      return response.data;
    } catch (err) {
      console.error("Error al actualizar por ID:", err);
      throw err;
    }
  };

  // 4. Eliminar documento
  const deleteProduct = async (id) => {
    try {
      await api.delete(`${API_URL}${id}/`);
      setDocuments((prev) => prev.filter((doc) => doc.id !== id));
    } catch (err) {
      console.error("Error al eliminar documento:", err);
      throw err;
    }
  };

  // --- BÚSQUEDAS LOCALES (INSTANTÁNEAS) ---

  const getDocumentByDoc = useCallback(
    (docCif) => {
      if (!docCif?.trim()) return [];
      const cif = docCif.trim();
      return documents.filter((d) => d.dataclient === cif);
    },
    [documents]
  );

  const fetchDocumentByNum = useCallback(
    (num_presupuesto) => {
      return (
        documents.find((doc) => doc.num_presupuesto === num_presupuesto) || null
      );
    },
    [documents]
  );

  const getDocumentsByObservaciones = useCallback(
    (searchText) => {
      if (!searchText?.trim()) return [];
      const text = searchText.trim().toLowerCase();
      return documents.filter(
        (doc) =>
          doc.observaciones && doc.observaciones.toLowerCase().includes(text)
      );
    },
    [documents]
  );

  const fetchDocumentById = useCallback(
    async (id) => {
      const localDoc = documents.find((d) => d.id === id);
      if (localDoc) return localDoc;

      try {
        const response = await api.get(`${API_URL}${id}/`);
        return response.data;
      } catch (err) {
        console.error("Error fetchDocumentById:", err);
        return null;
      }
    },
    [documents]
  );

  const clearDocuments = () => setDocuments([]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const value = useMemo(
    () => ({
      documents,
      loading,
      error,
      refetch,
      clearDocuments,
      addProduct,
      deleteProduct,
      fetchDocumentByNum,
      getDocumentByDoc,
      updateDocumentFieldsId,
      fetchDocumentById,
      getDocumentsByObservaciones,
    }),
    [
      documents,
      loading,
      error,
      refetch,
      getDocumentByDoc,
      getDocumentsByObservaciones,
      fetchDocumentById,
      fetchDocumentByNum,
    ]
  );

  return (
    <DocumentsContext.Provider value={value}>
      {loading && documents.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-screen bg-white">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-gray-500 font-medium">Sincronizando Archivos...</p>
        </div>
      ) : (
        children
      )}
    </DocumentsContext.Provider>
  );
};
