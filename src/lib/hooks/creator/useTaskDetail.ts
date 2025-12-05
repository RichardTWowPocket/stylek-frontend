import { useQuery } from '@tanstack/react-query';
import { getTaskById } from '@/lib/api/tasks';

export function useTaskDetail(taskId: string) {
  return useQuery({
    queryKey: ['creator', 'task', taskId],
    queryFn: () => getTaskById(taskId),
    enabled: !!taskId,
  });
}





