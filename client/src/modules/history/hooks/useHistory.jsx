

import { useApiHistoryContext } from "../context/HistoryProvider";

// Este es el hook que usas en tus componentes
const useHistory = () => {
  const context = useApiHistoryContext();

  if (!context) {
    throw new Error("useClients debe usarse dentro de PagosProvider");
  }

  return context;
};

export default useHistory;

