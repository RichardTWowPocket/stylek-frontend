'use client';

import { useState } from 'react';
import { useCreatorProfile } from '@/lib/hooks/creator/useCreator';
import { useUpdateCreatorProfile, useUpdateCreatorPlatforms, useUpdateCreatorBank } from '@/lib/hooks/creator/useCreatorMutations';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SkeletonCard } from '@/components/common/SkeletonCard';
import { ErrorState } from '@/components/common/ErrorState';
import { CreatorProfileForm } from '@/components/creator/CreatorProfileForm';
import { CreatorPlatformsForm } from '@/components/creator/CreatorPlatformsForm';
import { CreatorBankForm } from '@/components/creator/CreatorBankForm';
import { ProfileSection } from '@/components/account/ProfileSection';
import { SecuritySection } from '@/components/account/SecuritySection';
import { Edit, Check, X } from 'lucide-react';
import { toast } from '@/lib/ui/toast';

export default function CreatorProfilePage() {
  const { data: profile, isLoading, error } = useCreatorProfile();
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isEditingPlatforms, setIsEditingPlatforms] = useState(false);
  const [isEditingBank, setIsEditingBank] = useState(false);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    );
  }

  if (error) {
    return (
      <ErrorState
        title="Gagal memuat profil"
        description="Terjadi kesalahan saat memuat data profil creator."
      />
    );
  }

  if (!profile) {
    return null;
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-xl font-bold sm:text-2xl">Profil Creator</h1>
        <p className="text-sm text-muted-foreground sm:text-base">Kelola informasi profil, platform, dan rekening bank Anda</p>
      </div>

      {/* Profile Card */}
      <Card className="p-4 sm:p-6">
        <div className="mb-3 flex flex-col gap-2 sm:mb-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-base font-semibold sm:text-lg">Informasi Profil</h2>
          {!isEditingProfile && (
            <Button variant="outline" size="sm" onClick={() => setIsEditingProfile(true)} className="w-full sm:w-auto">
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Button>
          )}
        </div>

        {isEditingProfile ? (
          <CreatorProfileForm
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
                <p className="text-xs text-muted-foreground sm:text-sm">Nama Lengkap</p>
                <p className="font-medium text-sm sm:text-base">{profile.displayName}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground sm:text-sm">Tipe Creator</p>
                <p className="font-medium text-sm sm:text-base">
                  {profile.creatorType === 'INDIVIDUAL' ? 'Individual' : 'Agency'}
                </p>
              </div>
              {profile.mainNiche && (
                <div>
                  <p className="text-xs text-muted-foreground sm:text-sm">Niche Utama</p>
                  <p className="font-medium text-sm sm:text-base">{profile.mainNiche}</p>
                </div>
              )}
              {(profile.city || profile.province) && (
                <div>
                  <p className="text-xs text-muted-foreground sm:text-sm">Lokasi</p>
                  <p className="font-medium text-sm sm:text-base">
                    {profile.city && profile.province
                      ? `${profile.city}, ${profile.province}`
                      : profile.city || profile.province || '-'}
                  </p>
                </div>
              )}
            </div>
            {profile.bio && (
              <div>
                <p className="text-xs text-muted-foreground sm:text-sm">Bio</p>
                <p className="text-xs sm:text-sm">{profile.bio}</p>
              </div>
            )}
            {profile.additionalNiches && profile.additionalNiches.length > 0 && (
              <div>
                <p className="text-xs text-muted-foreground sm:text-sm">Niche Tambahan</p>
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {profile.additionalNiches.map((niche, idx) => (
                    <Badge key={idx} variant="secondary" className="text-xs">
                      {niche}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            <div>
              <p className="text-xs text-muted-foreground sm:text-sm">Status Verifikasi</p>
              <Badge
                variant={
                  profile.verifyStatus === 'SOCIAL_VERIFIED' || profile.verifyStatus === 'KYC_VERIFIED'
                    ? 'default'
                    : 'secondary'
                }
                className="text-xs mt-1"
              >
                {profile.verifyStatus === 'SOCIAL_VERIFIED'
                  ? 'Social Verified'
                  : profile.verifyStatus === 'KYC_VERIFIED'
                    ? 'KYC Verified'
                    : 'Unverified'}
              </Badge>
            </div>
          </div>
        )}
      </Card>

      {/* Platforms Card */}
      <Card className="p-4 sm:p-6">
        <div className="mb-3 flex flex-col gap-2 sm:mb-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-base font-semibold sm:text-lg">Platform Sosial Media</h2>
          {!isEditingPlatforms && (
            <Button variant="outline" size="sm" onClick={() => setIsEditingPlatforms(true)} className="w-full sm:w-auto">
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Button>
          )}
        </div>

        {isEditingPlatforms ? (
          <CreatorPlatformsForm
            defaultPlatforms={profile.platforms || []}
            onCancel={() => setIsEditingPlatforms(false)}
            onSuccess={() => {
              setIsEditingPlatforms(false);
              toast.success('Platform berhasil diperbarui');
            }}
          />
        ) : (
          <div className="space-y-2">
            {profile.platforms && profile.platforms.length > 0 ? (
              <div className="space-y-2">
                {profile.platforms.map((platform) => (
                  <div
                    key={platform.id}
                    className="flex flex-col gap-2 rounded-lg border border-border p-3 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-sm sm:text-base">{platform.platformType}</p>
                        {platform.isPrimary && (
                          <Badge variant="default" className="text-xs">
                            Utama
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground sm:text-sm">@{platform.handle}</p>
                      <div className="mt-1 flex flex-wrap gap-2 text-xs text-muted-foreground sm:gap-4">
                        <span>{platform.followers.toLocaleString('id-ID')} followers</span>
                        {platform.avgViews && (
                          <span>{platform.avgViews.toLocaleString('id-ID')} avg views</span>
                        )}
                        {platform.avgLikes && (
                          <span>{platform.avgLikes.toLocaleString('id-ID')} avg likes</span>
                        )}
                      </div>
                      <a
                        href={platform.profileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-1 text-xs text-primary hover:underline break-all sm:text-sm"
                      >
                        {platform.profileUrl}
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground sm:text-sm">Belum ada platform</p>
            )}
          </div>
        )}
      </Card>

      {/* Bank Info Card */}
      <Card className="p-4 sm:p-6">
        <div className="mb-3 flex flex-col gap-2 sm:mb-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-base font-semibold sm:text-lg">Informasi Rekening Bank</h2>
          {!isEditingBank && (
            <Button variant="outline" size="sm" onClick={() => setIsEditingBank(true)} className="w-full sm:w-auto">
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Button>
          )}
        </div>

        {isEditingBank ? (
          <CreatorBankForm
            defaultValues={profile}
            onCancel={() => setIsEditingBank(false)}
            onSuccess={() => {
              setIsEditingBank(false);
              toast.success('Informasi bank berhasil diperbarui');
            }}
          />
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {profile.bankAccountName && profile.bankAccountNumber && profile.bankName ? (
              <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 sm:gap-4">
                <div>
                  <p className="text-xs text-muted-foreground sm:text-sm">Nama Pemilik Rekening</p>
                  <p className="font-medium text-sm sm:text-base">{profile.bankAccountName}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground sm:text-sm">Nomor Rekening</p>
                  <p className="font-medium text-sm sm:text-base">{profile.bankAccountNumber}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground sm:text-sm">Nama Bank</p>
                  <p className="font-medium text-sm sm:text-base">{profile.bankName}</p>
                </div>
              </div>
            ) : (
              <p className="text-xs text-muted-foreground sm:text-sm">
                Belum ada informasi rekening bank. Silakan lengkapi untuk dapat melakukan withdrawal.
              </p>
            )}
          </div>
        )}
      </Card>

      {/* Account Profile Section */}
      <Card className="p-4 sm:p-6">
        <h2 className="mb-3 text-base font-semibold sm:mb-4 sm:text-lg">Informasi Akun</h2>
        <ProfileSection />
      </Card>

      {/* Security Section */}
      <Card className="p-4 sm:p-6">
        <h2 className="mb-3 text-base font-semibold sm:mb-4 sm:text-lg">Keamanan</h2>
        <SecuritySection />
      </Card>
    </div>
  );
}


