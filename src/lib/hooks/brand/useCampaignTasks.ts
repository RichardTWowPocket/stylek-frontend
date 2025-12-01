import { useQuery } from '@tanstack/react-query';
import { getCampaignTasks, getTaskById, type GetCampaignTasksParams } from '@/lib/api/tasks';
import { useBrandContentFiltersStore } from '@/store/brandContentFilters.store';

export function useCampaignTasks(campaignId: string) {
  const { status, platform, search } = useBrandContentFiltersStore();

  const filters: GetCampaignTasksParams = {
    status: status === 'ALL' ? undefined : status,
    platform: platform === 'ALL' ? undefined : platform,
    search: search || undefined,
  };

  return useQuery({
    queryKey: ['campaign', campaignId, 'tasks', filters],
    queryFn: () => getCampaignTasks(campaignId, filters),
    enabled: !!campaignId,
  });
}

export function useTaskDetail(taskId: string) {
  return useQuery({
    queryKey: ['task', taskId],
    queryFn: () => getTaskById(taskId),
    enabled: !!taskId,
  });
}

