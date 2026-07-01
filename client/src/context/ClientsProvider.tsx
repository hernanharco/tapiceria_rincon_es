import { createContext, useContext } from "react";
import { useClients, useCreateClient, useUpdateClient, useDeleteClient } from '@/hooks/queries/useClients';

const ClientsContext = createContext(null);

export const useApiClientsContext = () => {
  const context = useContext(ClientsContext);
  if (!context) throw new Error("useApiClientsContext debe usarse dentro de ClientsProvider");
  return context;
};

export const ClientsProvider = ({ children }) => {
  const { data: clients = [], isLoading, error, refetch } = useClients();
  const createMutation = useCreateClient();
  const updateMutation = useUpdateClient();
  const deleteMutation = useDeleteClient();

  // Filtro local por término de búsqueda
  const getFilteredClients = (term: string) => {
    if (!term?.trim()) return [];
    const t = term.trim().toLowerCase();
    return clients.filter(
      (c: any) =>
        c.name?.toLowerCase().includes(t) ||
        c.cif?.toLowerCase().includes(t)
    );
  };

  const value = {
    clients,
    loading: isLoading,
    error,
    refetchClients: refetch,
    getFilteredClients,
    addClients: (data: any) => createMutation.mutateAsync(data),
    updateClients: (id: number, data: any) => updateMutation.mutateAsync({ id, data }),
    deleteClients: (id: number) => deleteMutation.mutateAsync(id),
  };

  return (
    <ClientsContext.Provider value={value}>
      {children}
    </ClientsContext.Provider>
  );
};
