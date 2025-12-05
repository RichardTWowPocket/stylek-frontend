import { useMutation, useQueryClient } from '@tanstack/react-query';
import { applyToCampaign, type ApplyCampaignDto } from '@/lib/api/campaigns';
import { toast } from '@/hooks/use-toast';

export function useApplyCampaign(campaignId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ApplyCampaignDto) => applyToCampaign(campaignId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaign', campaignId] });
      queryClient.invalidateQueries({ queryKey: ['creator', 'applications'] });
      toast({
        title: 'Berhasil!',
        description: 'Aplikasi Anda telah dikirim. Tunggu review dari brand.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Gagal mengirim aplikasi',
        description: error?.response?.data?.message || 'Terjadi kesalahan saat mengirim aplikasi.',
        variant: 'destructive',
      });
    },
  });
}





