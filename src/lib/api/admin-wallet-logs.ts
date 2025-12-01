import { api } from './axios';

export type WalletType = 'BRAND' | 'CREATOR';

export interface AdminWalletLog {
  id: string;
  walletType: WalletType;
  ownerName: string;
  ownerId: string;
  transactionType: string;
  amount: number;
  relatedCampaignId?: string;
  relatedTaskId?: string;
  externalRef?: string;
  createdAt: string;
}

export interface GetAdminWalletLogsParams {
  walletType?: WalletType;
  fromDate?: string;
  toDate?: string;
  type?: string;
  page?: number;
  pageSize?: number;
}

export interface AdminWalletLogsResponse {
  data: AdminWalletLog[];
  total: number;
  page: number;
  pageSize: number;
}

export async function getAdminWalletLogs(
  params: GetAdminWalletLogsParams = {}
): Promise<AdminWalletLogsResponse> {
  const { walletType, fromDate, toDate, type, page = 1, pageSize = 20 } = params;
  const queryParams: Record<string, string | number> = {
    page,
    pageSize,
  };

  if (walletType) {
    queryParams.walletType = walletType;
  }

  if (fromDate) {
    queryParams.fromDate = fromDate;
  }

  if (toDate) {
    queryParams.toDate = toDate;
  }

  if (type) {
    queryParams.type = type;
  }

  const res = await api.get<AdminWalletLogsResponse>('/admin/logs/wallet', {
    params: queryParams,
  });
  return res.data;
}

