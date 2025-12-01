'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { useCreatorPublicProfile } from '@/lib/hooks/brand/useCreatorPublicProfile';
import { SkeletonCard } from '@/components/common/SkeletonCard';
import { ErrorState } from '@/components/common/ErrorState';
import { CheckCircle2, ExternalLink, Users, Star } from 'lucide-react';

interface CreatorProfileModalProps {
  creatorId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreatorProfileModal({ creatorId, open, onOpenChange }: CreatorProfileModalProps) {
  const { data: profile, isLoading, error } = useCreatorPublicProfile(creatorId);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Profil Creator</DialogTitle>
          <DialogDescription>Informasi lengkap tentang creator ini</DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <SkeletonCard />
        ) : error ? (
          <ErrorState
            title="Gagal memuat profil"
            description="Terjadi kesalahan saat memuat data profil creator."
          />
        ) : profile ? (
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-start gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={profile.avatarUrl} alt={profile.displayName} />
                <AvatarFallback>
                  {profile.displayName
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .toUpperCase()
                    .slice(0, 2)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-semibold">{profile.displayName}</h3>
                  {profile.verificationStatus === 'SOCIAL_VERIFIED' && (
                    <Badge variant="default" className="gap-1">
                      <CheckCircle2 className="h-3 w-3" />
                      Verified
                    </Badge>
                  )}
                </div>
                {profile.stats?.rating && (
                  <div className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span>{profile.stats.rating.toFixed(1)}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Location & Niche */}
            <Card className="p-4">
              <h4 className="mb-3 font-semibold">Lokasi & Niche</h4>
              <div className="grid gap-3 md:grid-cols-2">
                {(profile.city || profile.province) && (
                  <div>
                    <p className="text-sm text-muted-foreground">Lokasi</p>
                    <p className="font-medium">
                      {[profile.city, profile.province].filter(Boolean).join(', ') || '-'}
                    </p>
                  </div>
                )}
                {profile.mainNiche && (
                  <div>
                    <p className="text-sm text-muted-foreground">Main Niche</p>
                    <p className="font-medium">{profile.mainNiche}</p>
                  </div>
                )}
                {profile.additionalNiches && profile.additionalNiches.length > 0 && (
                  <div className="md:col-span-2">
                    <p className="mb-2 text-sm text-muted-foreground">Additional Niches</p>
                    <div className="flex flex-wrap gap-2">
                      {profile.additionalNiches.map((niche) => (
                        <Badge key={niche} variant="secondary">
                          {niche}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </Card>

            {/* Platforms */}
            {profile.platforms && profile.platforms.length > 0 && (
              <Card className="p-4">
                <h4 className="mb-3 font-semibold">Platform</h4>
                <div className="space-y-3">
                  {profile.platforms.map((platform) => (
                    <div
                      key={platform.id}
                      className="flex items-center justify-between rounded-lg border border-border p-3"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{platform.type}</p>
                          {platform.handle && (
                            <p className="text-sm text-muted-foreground">@{platform.handle}</p>
                          )}
                        </div>
                        <div className="mt-1 flex flex-wrap gap-4 text-sm text-muted-foreground">
                          {platform.followers && (
                            <span className="flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              {platform.followers.toLocaleString('id-ID')} followers
                            </span>
                          )}
                          {platform.avgViews && (
                            <span>{platform.avgViews.toLocaleString('id-ID')} avg views</span>
                          )}
                        </div>
                      </div>
                      {platform.profileUrl && (
                        <a
                          href={platform.profileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Stats */}
            {profile.stats && (
              <Card className="p-4">
                <h4 className="mb-3 font-semibold">Riwayat StyleK</h4>
                <div className="grid gap-3 md:grid-cols-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Completed Campaigns</p>
                    <p className="text-2xl font-bold">{profile.stats.completedCampaigns || 0}</p>
                  </div>
                  {profile.stats.completionRate !== undefined && (
                    <div>
                      <p className="text-sm text-muted-foreground">Completion Rate</p>
                      <p className="text-2xl font-bold">
                        {profile.stats.completionRate.toFixed(0)}%
                      </p>
                    </div>
                  )}
                  {profile.stats.rating && (
                    <div>
                      <p className="text-sm text-muted-foreground">Rating</p>
                      <p className="text-2xl font-bold">{profile.stats.rating.toFixed(1)}</p>
                    </div>
                  )}
                </div>
              </Card>
            )}
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

