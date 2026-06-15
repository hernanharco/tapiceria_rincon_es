import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/api/config';

const ENDPOINT = '/api/companies/';

export function useCompanies() {
  return useQuery({
    queryKey: ['companies'],
    queryFn: () => api.get(ENDPOINT).then(r => r.data),
  });
}

export function useCompany(cif: string) {
  return useQuery({
    queryKey: ['companies', cif],
    queryFn: () => api.get(`${ENDPOINT}${cif}/`).then(r => r.data),
    enabled: !!cif,
  });
}

export function useUpdateCompany() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ cif, data }: { cif: string; data: any }) =>
      api.patch(`${ENDPOINT}${cif}/`, data).then(r => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies'] });
    },
  });
}

export function useCreateCompany() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.post(ENDPOINT, data).then(r => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies'] });
    },
  });
}
