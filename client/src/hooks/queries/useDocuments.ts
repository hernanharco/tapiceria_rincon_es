import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/api/config';

const ENDPOINT = '/api/documents/';

export function useDocuments() {
  return useQuery({
    queryKey: ['documents'],
    queryFn: () => api.get(ENDPOINT).then(r => r.data),
  });
}

export function useDocument(id: number) {
  return useQuery({
    queryKey: ['documents', id],
    queryFn: () => api.get(`${ENDPOINT}${id}/`).then(r => r.data),
    enabled: !!id,
  });
}

export function useCreateDocument() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.post(ENDPOINT, data).then(r => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
    },
  });
}

export function useUpdateDocument() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) =>
      api.patch(`${ENDPOINT}${id}/`, data).then(r => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
    },
  });
}

export function useDeleteDocument() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => api.delete(`${ENDPOINT}${id}/`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
    },
  });
}
