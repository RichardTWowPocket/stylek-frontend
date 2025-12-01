import { api } from './axios';

export interface AdminBrand {
  id: string;
  name: string;
  logoUrl?: string;
  ownerEmail: string;
  city?: string;
  province?: string;
  category?: string;
  channels?: string[];
  verificationStatus: 'VERIFIED' | 'UNVERIFIED';
  verifyRejectedReason?: string;
  verifiedAt?: string;
  verifiedBy?: string;
  createdAt: string;
}

export interface AdminBrandDetail extends AdminBrand {
  walletSummary?: {
    availableBalance: number;
    lockedBalance: number;
  };
  verificationDocuments?: Array<{
    type: string;
    url: string;
    uploadedAt: string;
  }>;
}

export interface GetAdminBrandsParams {
  status?: 'VERIFIED' | 'UNVERIFIED';
  search?: string;
  page?: number;
  pageSize?: number;
}

export interface AdminBrandsResponse {
  data: AdminBrand[];
  total: number;
  page: number;
  pageSize: number;
}

export async function getAdminBrands(
  params: GetAdminBrandsParams = {}
): Promise<AdminBrandsResponse> {
  const { status, search, page = 1, pageSize = 20 } = params;
  const queryParams: Record<string, string | number> = {
    page,
    pageSize,
  };

  if (status) {
    queryParams.status = status;
  }

  if (search) {
    queryParams.search = search;
  }

  const res = await api.get<AdminBrandsResponse>('/admin/brands', {
    params: queryParams,
  });
  return res.data;
}

export async function getAdminBrandDetail(id: string): Promise<AdminBrandDetail> {
  const res = await api.get<AdminBrandDetail>(`/admin/brands/${id}`);
  return res.data;
}

export interface VerifyBrandPayload {
  approve: boolean;
  reason?: string;
}

export async function verifyBrand(id: string, payload: VerifyBrandPayload): Promise<void> {
  await api.post(`/admin/brands/${id}/verify`, payload);
}

