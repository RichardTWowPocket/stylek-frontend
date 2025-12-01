import { api } from './axios';

export interface AccountProfile {
  id: string;
  email: string | null;
  name: string | null;
  role: string;
  image: string | null;
  phoneNumber: string | null;
  emailVerified: Date | null;
  isSuspended: boolean;
  createdAt: Date;
  updatedAt: Date;
  hasBrand: boolean;
  hasCreator: boolean;
  hasProfile: 0 | 1;
  brand?: {
    id: string;
    name: string;
    verifyStatus: string;
  } | null;
  creator?: {
    id: string;
    displayName: string;
    verifyStatus: string;
  } | null;
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

// Note: These endpoints don't exist yet in the backend
// For now, we'll disable the update functionality
export async function updateAccountProfile(data: UpdateProfileDto): Promise<AccountProfile> {
  // TODO: Implement when backend adds PATCH /auth/profile endpoint
  throw new Error('Update profile endpoint not yet implemented');
  // const res = await api.patch<AccountProfile>('/auth/profile', data);
  // return res.data;
}

export async function changePassword(data: ChangePasswordDto): Promise<void> {
  // TODO: Implement when backend adds POST /auth/change-password endpoint
  throw new Error('Change password endpoint not yet implemented');
  // await api.post('/auth/change-password', data);
}

