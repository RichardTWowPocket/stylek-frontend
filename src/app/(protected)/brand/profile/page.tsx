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
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Profil Brand</h1>
        <p className="text-muted-foreground">Kelola informasi brand dan channels Anda</p>
      </div>

      {/* Profile Card */}
      <Card className="p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Informasi Brand</h2>
          {!isEditingProfile && (
            <Button variant="outline" size="sm" onClick={() => setIsEditingProfile(true)}>
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
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-sm text-muted-foreground">Nama Brand</p>
                <p className="font-medium">{profile.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Tipe Brand</p>
                <p className="font-medium">{profile.brandType}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Kategori</p>
                <p className="font-medium">{profile.category || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Lokasi</p>
                <p className="font-medium">
                  {profile.city && profile.province
                    ? `${profile.city}, ${profile.province}`
                    : '-'}
                </p>
              </div>
            </div>
            {profile.description && (
              <div>
                <p className="text-sm text-muted-foreground">Deskripsi</p>
                <p className="text-sm">{profile.description}</p>
              </div>
            )}
            <div>
              <p className="text-sm text-muted-foreground">Status Verifikasi</p>
              <Badge variant={profile.verifyStatus === 'VERIFIED' ? 'default' : 'secondary'}>
                {profile.verifyStatus === 'VERIFIED' ? 'Verified' : 'Unverified'}
              </Badge>
            </div>
          </div>
        )}
      </Card>

      {/* Channels Card */}
      <Card className="p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Channels</h2>
          {!isEditingChannels && (
            <Button variant="outline" size="sm" onClick={() => setIsEditingChannels(true)}>
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
                    className="flex items-center justify-between rounded-lg border border-border p-3"
                  >
                    <div>
                      <p className="font-medium">{channel.type}</p>
                      {channel.label && (
                        <p className="text-sm text-muted-foreground">{channel.label}</p>
                      )}
                      <a
                        href={channel.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline"
                      >
                        {channel.url}
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Belum ada channel</p>
            )}
          </div>
        )}
      </Card>
    </div>
  );
}

