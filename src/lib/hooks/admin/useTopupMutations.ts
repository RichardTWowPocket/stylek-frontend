import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  approveTopup,
  rejectTopup,
  type ApproveTopupPayload,
  type RejectTopupPayload,
} from '@/lib/api/admin-topups';
import { toast } from '@/lib/ui/toast';

export function useApproveTopup() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload?: ApproveTopupPayload }) =>
      approveTopup(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'topups'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'summary'] });
      queryClient.invalidateQueries({ queryKey: ['brand', 'wallet', 'summary'] });
      queryClient.invalidateQueries({ queryKey: ['brand', 'wallet', 'transactions'] });
      toast.success('Top-up approved. Brand balance updated.');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Gagal approve top-up');
    },
  });
}

export function useRejectTopup() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: RejectTopupPayload }) =>
      rejectTopup(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'topups'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'summary'] });
      toast.success('Top-up rejected.');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Gagal reject top-up');
    },
  });
}

