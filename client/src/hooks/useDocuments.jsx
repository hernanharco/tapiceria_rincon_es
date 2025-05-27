// src/hooks/useDataCompany.js

import { useApiDocumentsContext } from "../context/DocumentsProvider";

// Este es el hook que usas en tus componentes
const useDocuments = () => {
  
  const context = useApiDocumentsContext();

  if (!context) {
    throw new Error("useClients debe usarse dentro de DocumentsProvider");
  }

  return context;
};

export default useDocuments;