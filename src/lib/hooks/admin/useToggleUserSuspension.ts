import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toggleUserSuspension } from '@/lib/api/admin-users';
import { toast } from '@/lib/ui/toast';

export function useToggleUserSuspension() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, suspend }: { id: string; suspend: boolean }) =>
      toggleUserSuspension(id, suspend),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
      toast.success(
        variables.suspend ? 'User berhasil di-suspend' : 'User berhasil di-unsuspend'
      );
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Gagal mengubah status user');
    },
  });
}

