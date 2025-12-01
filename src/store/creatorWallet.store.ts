import { create } from 'zustand';
import type { CreatorWalletTransactionType } from '@/types/wallet';

type FilterTransactionType = CreatorWalletTransactionType | 'ALL';

interface CreatorWalletFilterState {
  transactionType: FilterTransactionType;
  page: number;
  pageSize: number;
  setTransactionType: (type: FilterTransactionType) => void;
  setPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;
  reset: () => void;
}

export const useCreatorWalletStore = create<CreatorWalletFilterState>((set) => ({
  transactionType: 'ALL',
  page: 1,
  pageSize: 20,
  setTransactionType: (type) => set({ transactionType: type, page: 1 }),
  setPage: (page) => set({ page }),
  setPageSize: (pageSize) => set({ pageSize, page: 1 }),
  reset: () => set({ transactionType: 'ALL', page: 1, pageSize: 20 }),
}));

