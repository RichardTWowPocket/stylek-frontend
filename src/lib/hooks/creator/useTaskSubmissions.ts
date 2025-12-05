import { useMutation, useQueryClient } from '@tanstack/react-query';
import { submitDraft, submitLive, type SubmitDraftDto, type SubmitLiveDto } from '@/lib/api/tasks';
import { toast } from '@/hooks/use-toast';

export function useSubmitDraft(taskId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SubmitDraftDto) => submitDraft(taskId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['creator', 'task', taskId] });
      queryClient.invalidateQueries({ queryKey: ['creator', 'tasks'] });
      toast({
        title: 'Berhasil!',
        description: 'Draft telah dikirim untuk review.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Gagal mengirim draft',
        description: error?.response?.data?.message || 'Terjadi kesalahan saat mengirim draft.',
        variant: 'destructive',
      });
    },
  });
}

export function useSubmitLive(taskId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SubmitLiveDto) => submitLive(taskId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['creator', 'task', taskId] });
      queryClient.invalidateQueries({ queryKey: ['creator', 'tasks'] });
      toast({
        title: 'Berhasil!',
        description: 'Live content telah dikirim untuk review.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Gagal mengirim live content',
        description: error?.response?.data?.message || 'Terjadi kesalahan saat mengirim live content.',
        variant: 'destructive',
      });
    },
  });
}





