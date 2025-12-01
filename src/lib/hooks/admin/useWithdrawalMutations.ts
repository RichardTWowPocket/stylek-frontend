import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  approveWithdrawal,
  rejectWithdrawal,
  type ApproveWithdrawalPayload,
  type RejectWithdrawalPayload,
} from '@/lib/api/admin-withdrawals';
import { toast } from '@/lib/ui/toast';

export function useApproveWithdrawal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload?: ApproveWithdrawalPayload }) =>
      approveWithdrawal(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'withdrawals'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'summary'] });
      queryClient.invalidateQueries({ queryKey: ['creator', 'wallet', 'summary'] });
      queryClient.invalidateQueries({ queryKey: ['creator', 'wallet', 'withdrawals'] });
      queryClient.invalidateQueries({ queryKey: ['creator', 'wallet', 'transactions'] });
      toast.success('Withdrawal approved. Creator balance updated.');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Gagal approve withdrawal');
    },
  });
}

export function useRejectWithdrawal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: RejectWithdrawalPayload }) =>
      rejectWithdrawal(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'withdrawals'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'summary'] });
      toast.success('Withdrawal rejected.');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Gagal reject withdrawal');
    },
  });
}

