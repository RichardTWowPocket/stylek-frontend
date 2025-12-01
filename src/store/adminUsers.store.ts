import { create } from 'zustand';
import type { UserRole, UserStatus } from '@/lib/api/admin-users';

type FilterRole = UserRole | 'ALL';
type FilterStatus = UserStatus | 'ALL';

interface AdminUsersFilterState {
  role: FilterRole;
  status: FilterStatus;
  search: string;
  page: number;
  pageSize: number;
  setRole: (role: FilterRole) => void;
  setStatus: (status: FilterStatus) => void;
  setSearch: (search: string) => void;
  setPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;
  reset: () => void;
}

export const useAdminUsersStore = create<AdminUsersFilterState>((set) => ({
  role: 'ALL',
  status: 'ALL',
  search: '',
  page: 1,
  pageSize: 20,
  setRole: (role) => set({ role, page: 1 }),
  setStatus: (status) => set({ status, page: 1 }),
  setSearch: (search) => set({ search, page: 1 }),
  setPage: (page) => set({ page }),
  setPageSize: (pageSize) => set({ pageSize, page: 1 }),
  reset: () => set({ role: 'ALL', status: 'ALL', search: '', page: 1, pageSize: 20 }),
}));

