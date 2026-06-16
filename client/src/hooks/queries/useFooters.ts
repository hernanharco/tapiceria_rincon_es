import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/api/config';

const ENDPOINT = '/api/footers/';

export function useFooters() {
  return useQuery({
    queryKey: ['footers'],
    queryFn: () => api.get(ENDPOINT).then(r => r.data),
  });
}

export function useCreateFooter() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.post(ENDPOINT, data).then(r => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['footers'] });
    },
  });
}

export function useUpdateFooter() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) =>
      api.patch(`${ENDPOINT}${id}/`, data).then(r => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['footers'] });
    },
  });
}
