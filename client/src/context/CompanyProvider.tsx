import { createContext, useContext } from "react";
import { useCompanies, useUpdateCompany, useCreateCompany } from '@/hooks/queries/useCompanies';

const CompanyContext = createContext(null);

export const useApiCompanyContext = () => {
  const context = useContext(CompanyContext);
  if (!context) {
    throw new Error("useApiCompanyContext debe usarse dentro de CompanyProvider");
  }
  return context;
};

export const CompanyProvider = ({ children }) => {
  const { data: empresas = [], isLoading, error, refetch } = useCompanies();
  const updateMutation = useUpdateCompany();
  const createMutation = useCreateCompany();

  const value = {
    empresas,
    loading: isLoading,
    error,
    actualizarEmpresa: (cif, data) => updateMutation.mutateAsync({ cif, data }),
    crearEmpresa: (data) => createMutation.mutateAsync(data),
    refetchEmpresas: refetch,
  };

  return (
    <CompanyContext.Provider value={value}>
      {children}
    </CompanyContext.Provider>
  );
};
