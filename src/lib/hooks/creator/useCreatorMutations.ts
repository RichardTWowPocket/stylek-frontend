import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  updateCreatorProfile,
  updateCreatorPlatforms,
  updateCreatorBank,
  type UpdateCreatorProfileDto,
  type UpdateCreatorPlatformsDto,
  type UpdateCreatorBankDto,
} from '@/lib/api/creator';

export function useUpdateCreatorProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateCreatorProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['creator', 'profile'] });
    },
  });
}

export function useUpdateCreatorPlatforms() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateCreatorPlatforms,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['creator', 'profile'] });
    },
  });
}

export function useUpdateCreatorBank() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateCreatorBank,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['creator', 'profile'] });
    },
  });
}


