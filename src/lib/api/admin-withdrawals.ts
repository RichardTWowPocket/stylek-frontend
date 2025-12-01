import { api } from './axios';
import type { WithdrawalStatus, WithdrawalRequest } from '@/types/wallet';

export interface AdminWithdrawal extends WithdrawalRequest {
  creatorName: string;
  creatorId: string;
  creatorEmail: string;
  bankAccountName: string;
  bankAccountNumber: string;
  bankName: string;
}

export interface GetAdminWithdrawalsParams {
  status?: WithdrawalStatus;
  page?: number;
  pageSize?: number;
}

export interface AdminWithdrawalsResponse {
  data: AdminWithdrawal[];
  total: number;
  page: number;
  pageSize: number;
}

export async function getAdminWithdrawals(
  params: GetAdminWithdrawalsParams = {}
): Promise<AdminWithdrawalsResponse> {
  const { status, page = 1, pageSize = 20 } = params;
  const queryParams: Record<string, string | number> = {
    page,
    pageSize,
  };

  if (status) {
    queryParams.status = status;
  }

  const res = await api.get<AdminWithdrawalsResponse>('/admin/withdrawals', {
    params: queryParams,
  });
  return res.data;
}

export interface ApproveWithdrawalPayload {
  externalRef?: string;
}

export async function approveWithdrawal(
  id: string,
  payload?: ApproveWithdrawalPayload
): Promise<void> {
  await api.post(`/admin/withdrawals/${id}/approve`, payload || {});
}

export interface RejectWithdrawalPayload {
  reason: string;
}

export async function rejectWithdrawal(
  id: string,
  payload: RejectWithdrawalPayload
): Promise<void> {
  await api.post(`/admin/withdrawals/${id}/reject`, payload);
}

