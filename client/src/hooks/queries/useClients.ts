import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/api/config';

const ENDPOINT = '/api/clients/';

export function useClients() {
  return useQuery({
    queryKey: ['clients'],
    queryFn: () => api.get(ENDPOINT).then(r => r.data),
  });
}

export function useCreateClient() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.post(ENDPOINT, data).then(r => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
    },
  });
}

export function useUpdateClient() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) =>
      api.patch(`${ENDPOINT}${id}/`, data).then(r => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
    },
  });
}

export function useDeleteClient() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => api.delete(`${ENDPOINT}${id}/`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
    },
  });
}
