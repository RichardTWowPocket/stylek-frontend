import { api } from './axios';
import type {
  BrandWalletSummary,
  BrandWalletTransaction,
  BrandWalletTransactionType,
  BrandTopUpRequest,
  TopUpStatus,
  BrandWalletTransactionsResponse,
  BrandTopUpRequestsResponse,
} from '@/types/wallet';

export async function getBrandWalletSummary(): Promise<BrandWalletSummary> {
  const res = await api.get<BrandWalletSummary>('/wallet/brand/summary');
  return res.data;
}

export interface GetBrandWalletTransactionsParams {
  page?: number;
  pageSize?: number;
  type?: BrandWalletTransactionType;
}

export async function getBrandWalletTransactions(
  params: GetBrandWalletTransactionsParams = {}
): Promise<BrandWalletTransactionsResponse> {
  const { page = 1, pageSize = 20, type } = params;
  const queryParams: Record<string, string | number> = {
    page,
    pageSize,
  };

  if (type) {
    queryParams.type = type;
  }

  const res = await api.get<BrandWalletTransactionsResponse>('/wallet/brand/transactions', {
    params: queryParams,
  });
  return res.data;
}

export interface CreateBrandTopUpData {
  amount: number;
  proofFile?: File;
}

export async function createBrandTopUp(data: CreateBrandTopUpData): Promise<BrandTopUpRequest> {
  const formData = new FormData();
  formData.append('amount', data.amount.toString());

  if (data.proofFile) {
    formData.append('proofFile', data.proofFile);
  }

  const res = await api.post<BrandTopUpRequest>('/wallet/brand/topups', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return res.data;
}

export interface GetBrandTopUpRequestsParams {
  status?: TopUpStatus;
  page?: number;
  pageSize?: number;
}

export async function getBrandTopUpRequests(
  params: GetBrandTopUpRequestsParams = {}
): Promise<BrandTopUpRequestsResponse> {
  const { status, page = 1, pageSize = 10 } = params;
  const queryParams: Record<string, string | number> = {
    page,
    pageSize,
  };

  if (status) {
    queryParams.status = status;
  }

  const res = await api.get<BrandTopUpRequestsResponse>('/wallet/brand/topups', {
    params: queryParams,
  });
  return res.data;
}

