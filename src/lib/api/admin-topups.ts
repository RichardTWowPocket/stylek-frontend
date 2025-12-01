import { api } from './axios';
import type { BrandTopUpRequest, TopUpStatus } from '@/types/wallet';

export interface GetAdminTopupsParams {
  status?: TopUpStatus;
  page?: number;
  pageSize?: number;
}

export interface AdminTopupsResponse {
  data: Array<BrandTopUpRequest & { brandName: string; brandId: string }>;
  total: number;
  page: number;
  pageSize: number;
}

export async function getAdminTopups(
  params: GetAdminTopupsParams = {}
): Promise<AdminTopupsResponse> {
  const { status, page = 1, pageSize = 20 } = params;
  const queryParams: Record<string, string | number> = {
    page,
    pageSize,
  };

  if (status) {
    queryParams.status = status;
  }

  const res = await api.get<AdminTopupsResponse>('/admin/topups', {
    params: queryParams,
  });
  return res.data;
}

export interface ApproveTopupPayload {
  note?: string;
}

export async function approveTopup(id: string, payload?: ApproveTopupPayload): Promise<void> {
  await api.post(`/admin/topups/${id}/approve`, payload || {});
}

export interface RejectTopupPayload {
  reason: string;
}

export async function rejectTopup(id: string, payload: RejectTopupPayload): Promise<void> {
  await api.post(`/admin/topups/${id}/reject`, payload);
}

