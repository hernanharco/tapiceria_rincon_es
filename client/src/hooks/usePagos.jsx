// src/hooks/useDataCompany.js

import { useApiPagosContext } from "../context/PagosProvider";

// Este es el hook que usas en tus componentes
const usePagos = () => {
  const context = useApiPagosContext();

  if (!context) {
    throw new Error("useClients debe usarse dentro de PagosProvider");
  }

  return context;
};

export default usePagos;