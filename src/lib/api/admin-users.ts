import { api } from './axios';

export type UserRole = 'BRAND' | 'CREATOR' | 'ADMIN';
export type UserStatus = 'ACTIVE' | 'SUSPENDED';

export interface AdminUser {
  id: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
  suspendedAt?: string;
  suspendedBy?: string;
}

export interface GetAdminUsersParams {
  role?: UserRole;
  status?: UserStatus;
  search?: string;
  page?: number;
  pageSize?: number;
}

export interface AdminUsersResponse {
  data: AdminUser[];
  total: number;
  page: number;
  pageSize: number;
}

export async function getAdminUsers(params: GetAdminUsersParams = {}): Promise<AdminUsersResponse> {
  const { role, status, search, page = 1, pageSize = 20 } = params;
  const queryParams: Record<string, string | number> = {
    page,
    pageSize,
  };

  if (role) {
    queryParams.role = role;
  }

  if (status) {
    queryParams.status = status;
  }

  if (search) {
    queryParams.search = search;
  }

  const res = await api.get<AdminUsersResponse>('/admin/users', {
    params: queryParams,
  });
  return res.data;
}

export async function toggleUserSuspension(id: string, suspend: boolean): Promise<void> {
  await api.post(`/admin/users/${id}/suspend`, { suspend });
}

