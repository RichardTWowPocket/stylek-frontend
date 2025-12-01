import { useQuery } from '@tanstack/react-query';
import { getCreatorTasks, type GetCreatorTasksParams } from '@/lib/api/tasks';

export function useCreatorTasks(params: GetCreatorTasksParams = {}) {
  return useQuery({
    queryKey: ['creator', 'tasks', params],
    queryFn: () => getCreatorTasks(params),
  });
}


