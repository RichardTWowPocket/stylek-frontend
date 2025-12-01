'use client';

import { useState } from 'react';
import { useBrandProfile } from '@/lib/hooks/brand/useBrand';
import { useUpdateBrandProfile, useUpdateBrandChannels } from '@/lib/hooks/brand/useBrandMutations';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SkeletonCard } from '@/components/common/SkeletonCard';
import { ErrorState } from '@/components/common/ErrorState';
import { BrandProfileForm } from '@/components/brand/BrandProfileForm';
import { BrandChannelsForm } from '@/components/brand/BrandChannelsForm';
import { Edit, Check, X } from 'lucide-react';
import { toast } from '@/lib/ui/toast';

export default function BrandProfilePage() {
  const { data: profile, isLoading, error } = useBrandProfile();
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isEditingChannels, setIsEditingChannels] = useState(false);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <SkeletonCard />
        <SkeletonCard />
      </div>
    );
  }

  if (error) {
    return (
      <ErrorState
        title="Gagal memuat profil"
        description="Terjadi kesalahan saat memuat data profil brand."
      />
    );
  }

  if (!profile) {
    return null;
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-xl font-bold sm:text-2xl">Profil Brand</h1>
        <p className="text-sm text-muted-foreground sm:text-base">Kelola informasi brand dan channels Anda</p>
      </div>

      {/* Profile Card */}
      <Card className="p-4 sm:p-6">
        <div className="mb-3 flex flex-col gap-2 sm:mb-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-base font-semibold sm:text-lg">Informasi Brand</h2>
          {!isEditingProfile && (
            <Button variant="outline" size="sm" onClick={() => setIsEditingProfile(true)} className="w-full sm:w-auto">
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Button>
          )}
        </div>

        {isEditingProfile ? (
          <BrandProfileForm
            defaultValues={profile}
            onCancel={() => setIsEditingProfile(false)}
            onSuccess={() => {
              setIsEditingProfile(false);
              toast.success('Profil berhasil diperbarui');
            }}
          />
        ) : (
          <div className="space-y-3 sm:space-y-4">
            <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 sm:gap-4">
              <div>
                <p className="text-xs text-muted-foreground sm:text-sm">Nama Brand</p>
                <p className="font-medium text-sm sm:text-base">{profile.name}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground sm:text-sm">Tipe Brand</p>
                <p className="font-medium text-sm sm:text-base">{profile.brandType}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground sm:text-sm">Kategori</p>
                <p className="font-medium text-sm sm:text-base">{profile.category || '-'}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground sm:text-sm">Lokasi</p>
                <p className="font-medium text-sm sm:text-base">
                  {profile.city && profile.province
                    ? `${profile.city}, ${profile.province}`
                    : '-'}
                </p>
              </div>
            </div>
            {profile.description && (
              <div>
                <p className="text-xs text-muted-foreground sm:text-sm">Deskripsi</p>
                <p className="text-xs sm:text-sm">{profile.description}</p>
              </div>
            )}
            <div>
              <p className="text-xs text-muted-foreground sm:text-sm">Status Verifikasi</p>
              <Badge variant={profile.verifyStatus === 'VERIFIED' ? 'default' : 'secondary'} className="text-xs mt-1">
                {profile.verifyStatus === 'VERIFIED' ? 'Verified' : 'Unverified'}
              </Badge>
            </div>
          </div>
        )}
      </Card>

      {/* Channels Card */}
      <Card className="p-4 sm:p-6">
        <div className="mb-3 flex flex-col gap-2 sm:mb-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-base font-semibold sm:text-lg">Channels</h2>
          {!isEditingChannels && (
            <Button variant="outline" size="sm" onClick={() => setIsEditingChannels(true)} className="w-full sm:w-auto">
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Button>
          )}
        </div>

        {isEditingChannels ? (
          <BrandChannelsForm
            defaultChannels={profile.channels || []}
            onCancel={() => setIsEditingChannels(false)}
            onSuccess={() => {
              setIsEditingChannels(false);
              toast.success('Channels berhasil diperbarui');
            }}
          />
        ) : (
          <div className="space-y-2">
            {profile.channels && profile.channels.length > 0 ? (
              <div className="space-y-2">
                {profile.channels.map((channel) => (
                  <div
                    key={channel.id}
                    className="flex flex-col gap-2 rounded-lg border border-border p-3 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm sm:text-base">{channel.type}</p>
                      {channel.label && (
                        <p className="text-xs text-muted-foreground sm:text-sm">{channel.label}</p>
                      )}
                      <a
                        href={channel.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-primary hover:underline break-all sm:text-sm"
                      >
                        {channel.url}
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground sm:text-sm">Belum ada channel</p>
            )}
          </div>
        )}
      </Card>
    </div>
  );
}

