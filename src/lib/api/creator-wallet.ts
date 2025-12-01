import { api } from './axios';
import type {
  CreatorWalletSummary,
  CreatorWalletTransaction,
  CreatorWalletTransactionType,
  WithdrawalRequest,
  WithdrawalStatus,
  CreatorWalletTransactionsResponse,
  WithdrawalRequestsResponse,
} from '@/types/wallet';

export async function getCreatorWalletSummary(): Promise<CreatorWalletSummary> {
  const res = await api.get<CreatorWalletSummary>('/wallet/creator/summary');
  return res.data;
}

export interface GetCreatorWalletTransactionsParams {
  page?: number;
  pageSize?: number;
  type?: CreatorWalletTransactionType;
}

export async function getCreatorWalletTransactions(
  params: GetCreatorWalletTransactionsParams = {}
): Promise<CreatorWalletTransactionsResponse> {
  const { page = 1, pageSize = 20, type } = params;
  const queryParams: Record<string, string | number> = {
    page,
    pageSize,
  };

  if (type) {
    queryParams.type = type;
  }

  const res = await api.get<CreatorWalletTransactionsResponse>('/wallet/creator/transactions', {
    params: queryParams,
  });
  return res.data;
}

export interface GetWithdrawalRequestsParams {
  status?: WithdrawalStatus;
  page?: number;
  pageSize?: number;
}

export async function getWithdrawalRequests(
  params: GetWithdrawalRequestsParams = {}
): Promise<WithdrawalRequestsResponse> {
  const { status, page = 1, pageSize = 10 } = params;
  const queryParams: Record<string, string | number> = {
    page,
    pageSize,
  };

  if (status) {
    queryParams.status = status;
  }

  const res = await api.get<WithdrawalRequestsResponse>('/wallet/creator/withdrawals', {
    params: queryParams,
  });
  return res.data;
}

export interface CreateWithdrawalRequestData {
  amount: number;
  bankAccountId?: string;
}

export async function createWithdrawalRequest(
  data: CreateWithdrawalRequestData
): Promise<WithdrawalRequest> {
  const res = await api.post<WithdrawalRequest>('/wallet/creator/withdrawals', data);
  return res.data;
}

