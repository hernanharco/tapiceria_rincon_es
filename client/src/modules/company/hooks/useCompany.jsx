// src/hooks/useDataCompany.js

import { useApiCompanyContext } from "../context/CompanyProvider";

// Este es el hook que usas en tus componentes
const useCompany = () => {
  const context = useApiCompanyContext();

  if (!context) {
    throw new Error("useDataCompany debe usarse dentro de DataCompanyProvider");
  }

  return context;
};

export default useCompany;

