

import { useApiKeysContext } from "../context/KeysProvider";

// Este es el hook que usas en tus componentes
const useKeys = () => {
  const context = useApiKeysContext();

  if (!context) {
    throw new Error("useClients debe usarse dentro de PagosProvider");
  }

  return context;
};

export default useKeys;