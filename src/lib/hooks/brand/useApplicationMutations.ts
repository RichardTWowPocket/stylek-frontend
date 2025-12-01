import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  acceptApplication,
  rejectApplication,
  waitlistApplication,
} from '@/lib/api/campaigns';
import { toast } from '@/lib/ui/toast';

export function useAcceptApplication(campaignId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (applicationId: string) => acceptApplication(campaignId, applicationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaign', campaignId, 'applications'] });
      queryClient.invalidateQueries({ queryKey: ['campaign', campaignId, 'tasks'] });
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      toast.success('Applicant diterima. Creator akan menerima notifikasi.');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Gagal menerima applicant');
    },
  });
}

export function useRejectApplication(campaignId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (applicationId: string) => rejectApplication(campaignId, applicationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaign', campaignId, 'applications'] });
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      toast.success('Applicant ditolak. Creator akan menerima notifikasi.');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Gagal menolak applicant');
    },
  });
}

export function useWaitlistApplication(campaignId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (applicationId: string) => waitlistApplication(campaignId, applicationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaign', campaignId, 'applications'] });
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      toast.success('Applicant ditambahkan ke waitlist');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Gagal menambahkan ke waitlist');
    },
  });
}

