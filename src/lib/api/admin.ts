import { api } from './axios';

export interface AdminSummary {
  brandsPendingVerification: number;
  topupsPending: number;
  withdrawalsPending: number;
  totalLockedFunds: number;
  recentTopups: Array<{
    id: string;
    brandName: string;
    amount: number;
    status: string;
  }>;
  recentWithdrawals: Array<{
    id: string;
    creatorName: string;
    amount: number;
    status: string;
  }>;
}

export async function getAdminSummary(): Promise<AdminSummary> {
  const res = await api.get<AdminSummary>('/admin/summary');
  return res.data;
}

