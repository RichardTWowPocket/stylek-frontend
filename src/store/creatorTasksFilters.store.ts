import { create } from 'zustand';
import type { TaskStatus } from '@/lib/api/tasks';

interface CreatorTasksFiltersState {
  status: TaskStatus | 'ALL';
  page: number;
  pageSize: number;
  setStatus: (status: TaskStatus | 'ALL') => void;
  setPage: (page: number) => void;
  resetFilters: () => void;
}

export const useCreatorTasksFiltersStore = create<CreatorTasksFiltersState>((set) => ({
  status: 'ALL',
  page: 1,
  pageSize: 20,
  setStatus: (status) => set({ status, page: 1 }),
  setPage: (page) => set({ page }),
  resetFilters: () =>
    set({
      status: 'ALL',
      page: 1,
    }),
}));


