import { useMutation, useQueryClient } from '@tanstack/react-query';
import { verifyBrand, type VerifyBrandPayload } from '@/lib/api/admin-brands';
import { toast } from '@/lib/ui/toast';

export function useVerifyBrand() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: VerifyBrandPayload }) =>
      verifyBrand(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'brands'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'brands', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'summary'] });
      
      if (variables.payload.approve) {
        toast.success('Brand berhasil diverifikasi');
      } else {
        toast.success('Verifikasi brand ditolak');
      }
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Gagal memproses verifikasi brand');
    },
  });
}

