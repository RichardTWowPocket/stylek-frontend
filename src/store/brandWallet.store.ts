import { create } from 'zustand';
import type { BrandWalletTransactionType } from '@/types/wallet';

type FilterTransactionType = BrandWalletTransactionType | 'ALL';

interface BrandWalletFilterState {
  transactionType: FilterTransactionType;
  page: number;
  pageSize: number;
  setTransactionType: (type: FilterTransactionType) => void;
  setPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;
  reset: () => void;
}

export const useBrandWalletStore = create<BrandWalletFilterState>((set) => ({
  transactionType: 'ALL',
  page: 1,
  pageSize: 20,
  setTransactionType: (type) => set({ transactionType: type, page: 1 }),
  setPage: (page) => set({ page }),
  setPageSize: (pageSize) => set({ pageSize, page: 1 }),
  reset: () => set({ transactionType: 'ALL', page: 1, pageSize: 20 }),
}));

