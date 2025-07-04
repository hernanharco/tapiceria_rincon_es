// src/hooks/useDataCompany.js

import { useApiClientsContext } from "../context/ClientsProvider"

// Este es el hook que usas en tus componentes
const useClients = () => {
  const context = useApiClientsContext();

  if (!context) {
    throw new Error("useClients debe usarse dentro de ClientsProvider");
  }

  return context;
};

export default useClients;