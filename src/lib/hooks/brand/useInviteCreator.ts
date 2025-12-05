import { useMutation, useQueryClient } from '@tanstack/react-query';
import { inviteCreatorToCampaign, type InviteCreatorDto } from '@/lib/api/creators';
import { useToast } from '@/hooks/use-toast';

export function useInviteCreator(campaignId: string) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: InviteCreatorDto) => inviteCreatorToCampaign(campaignId, data),
    onSuccess: () => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['campaigns', campaignId] });
      queryClient.invalidateQueries({ queryKey: ['campaigns', 'brand'] });
      queryClient.invalidateQueries({ queryKey: ['applications'] });
      
      toast({
        title: 'Berhasil!',
        description: 'Creator berhasil diundang ke campaign.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Gagal mengundang creator',
        description: error?.response?.data?.message || 'Terjadi kesalahan saat mengundang creator.',
        variant: 'destructive',
      });
    },
  });
}






