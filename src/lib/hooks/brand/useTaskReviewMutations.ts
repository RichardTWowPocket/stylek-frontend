import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  reviewDraftApprove,
  reviewDraftRequestRevision,
  reviewLiveApprove,
  reviewLiveRequestRevision,
  reviewLiveReject,
  getTaskById,
} from '@/lib/api/tasks';
import { toast } from '@/lib/ui/toast';

export function useReviewDraft(taskId: string, campaignId: string) {
  const queryClient = useQueryClient();

  const approve = useMutation({
    mutationFn: () => reviewDraftApprove(taskId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaign', campaignId, 'tasks'] });
      queryClient.invalidateQueries({ queryKey: ['task', taskId] });
      queryClient.invalidateQueries({ queryKey: ['creator', 'task', taskId] }); // Invalidate creator's task detail query
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      // Refetch immediately to show updated status
      queryClient.refetchQueries({ queryKey: ['task', taskId] });
      queryClient.refetchQueries({ queryKey: ['creator', 'task', taskId] }); // Refetch creator's task detail
      toast.success('Draft approved. Creator akan menerima notifikasi.');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Gagal approve draft');
    },
  });

  const requestRevision = useMutation({
    mutationFn: (note: string) => reviewDraftRequestRevision(taskId, note),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaign', campaignId, 'tasks'] });
      queryClient.invalidateQueries({ queryKey: ['task', taskId] });
      queryClient.invalidateQueries({ queryKey: ['creator', 'task', taskId] }); // Invalidate creator's task detail query
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      // Refetch immediately to show updated status
      queryClient.refetchQueries({ queryKey: ['task', taskId] });
      queryClient.refetchQueries({ queryKey: ['creator', 'task', taskId] }); // Refetch creator's task detail
      toast.success('Revision requested. Creator akan menerima notifikasi.');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Gagal request revision');
    },
  });

  return {
    approve,
    requestRevision,
  };
}

export function useReviewLive(taskId: string, campaignId: string, creatorId?: string) {
  const queryClient = useQueryClient();

  const approve = useMutation({
    mutationFn: () => reviewLiveApprove(taskId),
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ['campaign', campaignId, 'tasks'] });
      queryClient.invalidateQueries({ queryKey: ['task', taskId] });
      queryClient.invalidateQueries({ queryKey: ['creator', 'task', taskId] }); // Invalidate creator's task detail query
      queryClient.invalidateQueries({ queryKey: ['brand', 'wallet', 'summary'] });
      queryClient.invalidateQueries({ queryKey: ['brand', 'wallet', 'transactions'] });
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      // Refetch immediately to show updated status
      queryClient.refetchQueries({ queryKey: ['task', taskId] });
      queryClient.refetchQueries({ queryKey: ['creator', 'task', taskId] }); // Refetch creator's task detail
      
      if (creatorId) {
        queryClient.invalidateQueries({ queryKey: ['creator', creatorId, 'wallet', 'summary'] });
        queryClient.invalidateQueries({ queryKey: ['creator', 'wallet', 'summary'] });
        queryClient.invalidateQueries({ queryKey: ['creator', 'wallet', 'transactions'] });
      }
      
      toast.success('Content approved. Creator akan menerima notifikasi.');
    },
    onError: (err: any) => {
      const errorCode = err.response?.data?.code || err.response?.data?.message;
      if (errorCode?.includes('INSUFFICIENT_LOCKED_FUNDS')) {
        toast.error('Saldo terkunci tidak mencukupi. Silakan cek wallet Anda.');
      } else {
        toast.error(err.response?.data?.message || 'Gagal approve content');
      }
    },
  });

  const requestRevision = useMutation({
    mutationFn: (note: string) => reviewLiveRequestRevision(taskId, note),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaign', campaignId, 'tasks'] });
      queryClient.invalidateQueries({ queryKey: ['task', taskId] });
      queryClient.invalidateQueries({ queryKey: ['creator', 'task', taskId] }); // Invalidate creator's task detail query
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      // Refetch immediately to show updated status
      queryClient.refetchQueries({ queryKey: ['task', taskId] });
      queryClient.refetchQueries({ queryKey: ['creator', 'task', taskId] }); // Refetch creator's task detail
      toast.success('Revision requested. Creator akan menerima notifikasi.');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Gagal request revision');
    },
  });

  const reject = useMutation({
    mutationFn: (note: string) => reviewLiveReject(taskId, note),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaign', campaignId, 'tasks'] });
      queryClient.invalidateQueries({ queryKey: ['task', taskId] });
      queryClient.invalidateQueries({ queryKey: ['creator', 'task', taskId] }); // Invalidate creator's task detail query
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      // Refetch immediately to show updated status
      queryClient.refetchQueries({ queryKey: ['task', taskId] });
      queryClient.refetchQueries({ queryKey: ['creator', 'task', taskId] }); // Refetch creator's task detail
      toast.success('Content rejected. Creator akan menerima notifikasi.');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Gagal reject content');
    },
  });

  return {
    approve,
    requestRevision,
    reject,
  };
}

