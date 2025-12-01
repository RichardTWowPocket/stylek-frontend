import { api } from './axios';

export interface RegisterBrandDto {
  email: string;
  password: string;
}

export interface RegisterCreatorDto {
  email: string;
  password: string;
}

export async function registerBrand(data: RegisterBrandDto) {
  // Backend uses single /auth/register endpoint with role
  // name and phoneNumber are optional, will be filled during onboarding
  const response = await api.post('/auth/register', {
    email: data.email,
    password: data.password,
    role: 'BRAND',
  });
  return response.data;
}

export async function registerCreator(data: RegisterCreatorDto) {
  // Backend uses single /auth/register endpoint with role
  // name and phoneNumber are optional, will be filled during onboarding
  const response = await api.post('/auth/register', {
    email: data.email,
    password: data.password,
    role: 'CREATOR',
  });
  return response.data;
}

export interface CompleteBrandProfileDto {
  name: string;
  brandType?: 'BRAND' | 'AGENCY' | 'ONLINESHOP';
  description?: string;
  category?: string;
  city?: string;
  province?: string;
}

export interface CompleteCreatorProfileDto {
  displayName: string;
  creatorType?: 'INDIVIDUAL' | 'AGENCY_CREATOR';
  bio?: string;
  mainNiche?: string;
  city?: string;
  province?: string;
}

export async function completeBrandProfile(data: CompleteBrandProfileDto) {
  const response = await api.post('/auth/complete-brand-profile', data);
  return response.data;
}

export async function completeCreatorProfile(data: CompleteCreatorProfileDto) {
  const response = await api.post('/auth/complete-creator-profile', data);
  return response.data;
}


