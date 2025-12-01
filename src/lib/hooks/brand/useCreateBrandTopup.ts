import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createBrandTopUp, type CreateBrandTopUpData } from '@/lib/api/brand-wallet';
import { toast } from '@/lib/ui/toast';

export function useCreateBrandTopup() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateBrandTopUpData) => createBrandTopUp(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['brand', 'wallet', 'summary'] });
      queryClient.invalidateQueries({ queryKey: ['brand', 'wallet', 'topups'] });
      toast.success('Top-up request berhasil dibuat. Menunggu approval admin.');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Gagal membuat top-up request');
    },
  });
}

