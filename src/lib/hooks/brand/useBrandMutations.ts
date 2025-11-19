import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  updateBrandProfile,
  updateBrandChannels,
  requestBrandVerification,
  type UpdateBrandProfileDto,
  type UpdateBrandChannelsDto,
  type VerifyRequestDto,
} from '@/lib/api/brand';

export function useUpdateBrandProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateBrandProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['brand', 'profile'] });
    },
  });
}

export function useUpdateBrandChannels() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateBrandChannels,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['brand', 'profile'] });
      queryClient.invalidateQueries({ queryKey: ['brand', 'channels'] });
    },
  });
}

export function useRequestBrandVerification() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: requestBrandVerification,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['brand', 'profile'] });
    },
  });
}

