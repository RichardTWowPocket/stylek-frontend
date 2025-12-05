import { useQuery } from '@tanstack/react-query';
import { searchCreators, type SearchCreatorsParams } from '@/lib/api/creators';

export function useSearchCreators(params: SearchCreatorsParams = {}) {
  return useQuery({
    queryKey: ['creators', 'search', params],
    queryFn: () => searchCreators(params),
    staleTime: 30000, // 30 seconds
  });
}






