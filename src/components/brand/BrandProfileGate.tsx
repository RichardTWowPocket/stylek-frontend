'use client';

import { ReactNode } from 'react';
import { useEnsureBrandProfile } from '@/lib/hooks/brand/useEnsureBrandProfile';
import { SkeletonCard } from '@/components/common/SkeletonCard';
import { ErrorState } from '@/components/common/ErrorState';

interface BrandProfileGateProps {
  children: ReactNode;
}

export function BrandProfileGate({ children }: BrandProfileGateProps) {
  const { isLoading, error } = useEnsureBrandProfile();

  if (isLoading) {
    return (
      <div className="space-y-4">
        <SkeletonCard />
        <SkeletonCard />
      </div>
    );
  }

  if (error) {
    const status = (error as any)?.response?.status;
    if (status === 404) {
      // Brand profile doesn't exist - redirect handled by hook
      return null;
    }
    return (
      <ErrorState
        title="Gagal memuat profil brand"
        description="Terjadi kesalahan saat memuat data profil."
      />
    );
  }

  return <>{children}</>;
}

