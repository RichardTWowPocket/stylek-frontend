// Brand Wallet Types
export type BrandWalletTransactionType =
  | 'TOP_UP'
  | 'LOCK_FUNDS'
  | 'UNLOCK_FUNDS'
  | 'PAYOUT_TO_CREATOR'
  | 'ADJUSTMENT';

export type TopUpStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface BrandWalletSummary {
  availableBalance: number;
  lockedBalance: number;
}

export interface BrandWalletTransaction {
  id: string;
  type: BrandWalletTransactionType;
  amount: number;
  description?: string;
  relatedCampaignId?: string;
  createdAt: string;
}

export interface BrandTopUpRequest {
  id: string;
  amount: number;
  status: TopUpStatus;
  proofImageUrl?: string;
  createdAt: string;
  processedAt?: string;
}

export interface BrandWalletTransactionsResponse {
  data: BrandWalletTransaction[];
  total: number;
  page: number;
  pageSize: number;
}

export interface BrandTopUpRequestsResponse {
  data: BrandTopUpRequest[];
  total: number;
  page: number;
  pageSize: number;
}

// Creator Wallet Types
export type CreatorWalletTransactionType =
  | 'CAMPAIGN_REWARD'
  | 'CASHBACK'
  | 'BONUS'
  | 'WITHDRAWAL'
  | 'ADJUSTMENT';

export type WithdrawalStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface CreatorWalletSummary {
  walletBalance: number;
  pendingEarnings: number;
  lifetimeEarnings: number;
}

export interface CreatorWalletTransaction {
  id: string;
  type: CreatorWalletTransactionType;
  amount: number;
  description?: string;
  relatedCampaignId?: string;
  relatedTaskId?: string;
  createdAt: string;
}

export interface WithdrawalRequest {
  id: string;
  amount: number;
  status: WithdrawalStatus;
  createdAt: string;
  processedAt?: string;
}

export interface CreatorWalletTransactionsResponse {
  data: CreatorWalletTransaction[];
  total: number;
  page: number;
  pageSize: number;
}

export interface WithdrawalRequestsResponse {
  data: WithdrawalRequest[];
  total: number;
  page: number;
  pageSize: number;
}

