import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createCampaign,
  updateCampaign,
  publishCampaign,
  type CreateCampaignDto,
  type UpdateCampaignDto,
} from '@/lib/api/campaigns';

export function useCreateCampaign() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCampaign,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['brand', 'campaigns'] });
      queryClient.invalidateQueries({ queryKey: ['brand', 'campaigns', 'summary'] });
    },
  });
}

export function useUpdateCampaign() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCampaignDto }) =>
      updateCampaign(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['campaign', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['brand', 'campaigns'] });
    },
  });
}

export function usePublishCampaign() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: publishCampaign,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['campaign', data.id] });
      queryClient.invalidateQueries({ queryKey: ['brand', 'campaigns'] });
      queryClient.invalidateQueries({ queryKey: ['brand', 'campaigns', 'summary'] });
    },
  });
}

