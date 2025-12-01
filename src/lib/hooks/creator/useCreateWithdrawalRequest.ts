import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createWithdrawalRequest,
  type CreateWithdrawalRequestData,
} from '@/lib/api/creator-wallet';
import { toast } from '@/lib/ui/toast';

export function useCreateWithdrawalRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateWithdrawalRequestData) => createWithdrawalRequest(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['creator', 'wallet', 'summary'] });
      queryClient.invalidateQueries({ queryKey: ['creator', 'wallet', 'withdrawals'] });
      toast.success('Withdrawal request berhasil dibuat. Menunggu approval admin.');
    },
    onError: (err: any) => {
      const errorMessage = err.response?.data?.message || 'Gagal membuat withdrawal request';
      if (errorMessage.includes('INSUFFICIENT_BALANCE') || errorMessage.includes('balance')) {
        toast.error('Saldo tidak mencukupi');
      } else {
        toast.error(errorMessage);
      }
    },
  });
}

