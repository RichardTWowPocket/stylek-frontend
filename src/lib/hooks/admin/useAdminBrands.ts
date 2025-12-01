import { useQuery } from '@tanstack/react-query';
import { getAdminBrands, getAdminBrandDetail, type GetAdminBrandsParams } from '@/lib/api/admin-brands';
import { useAdminBrandsStore } from '@/store/adminBrands.store';

export function useAdminBrands() {
  const { status, search, page, pageSize } = useAdminBrandsStore();

  const params: GetAdminBrandsParams = {
    status: status === 'ALL' ? undefined : status,
    search: search || undefined,
    page,
    pageSize,
  };

  return useQuery({
    queryKey: ['admin', 'brands', params],
    queryFn: () => getAdminBrands(params),
  });
}

export function useAdminBrandDetail(id: string) {
  return useQuery({
    queryKey: ['admin', 'brands', id],
    queryFn: () => getAdminBrandDetail(id),
    enabled: !!id,
  });
}

