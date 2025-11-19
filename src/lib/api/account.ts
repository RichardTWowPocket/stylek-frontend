import { api } from './axios';

export interface AccountProfile {
  id: string;
  name: string;
  email: string;
  phoneNumber?: string;
}

export interface UpdateProfileDto {
  name: string;
  phoneNumber: string;
}

export interface ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
}

export async function getAccountProfile(): Promise<AccountProfile> {
  const res = await api.get<AccountProfile>('/auth/me');
  return res.data;
}

export async function updateAccountProfile(data: UpdateProfileDto): Promise<AccountProfile> {
  const res = await api.patch<AccountProfile>('/auth/profile', data);
  return res.data;
}

export async function changePassword(data: ChangePasswordDto): Promise<void> {
  await api.post('/auth/change-password', data);
}

