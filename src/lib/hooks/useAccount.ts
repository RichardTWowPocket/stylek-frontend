import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getAccountProfile,
  updateAccountProfile,
  changePassword,
  type UpdateProfileDto,
  type ChangePasswordDto,
} from '@/lib/api/account';

export function useAccountProfile() {
  return useQuery({
    queryKey: ['account', 'profile'],
    queryFn: getAccountProfile,
  });
}

export function useUpdateAccountProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateAccountProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['account', 'profile'] });
    },
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: changePassword,
  });
}

