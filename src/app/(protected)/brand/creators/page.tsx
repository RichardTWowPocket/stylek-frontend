'use client';

import { useState, useEffect } from 'react';
import { useSearchCreators } from '@/lib/hooks/brand/useSearchCreators';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/common/EmptyState';
import { SkeletonCard } from '@/components/common/SkeletonCard';
import { ErrorState } from '@/components/common/ErrorState';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Search, Users, CheckCircle2, ExternalLink } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CreatorProfileModal } from '@/components/brand/CreatorProfileModal';
import { InviteCreatorDialog } from '@/components/brand/InviteCreatorDialog';
import type { Creator, SocialPlatformType } from '@/lib/api/creators';

const platformOptions: Array<{ value: SocialPlatformType; label: string }> = [
  { value: 'INSTAGRAM', label: 'Instagram' },
  { value: 'TIKTOK', label: 'TikTok' },
  { value: 'YOUTUBE', label: 'YouTube' },
  { value: 'BLOG', label: 'Blog' },
  { value: 'X_TWITTER', label: 'X (Twitter)' },
];

export default function BrandCreatorsPage() {
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [mainNiche, setMainNiche] = useState('');
  const [debouncedMainNiche, setDebouncedMainNiche] = useState('');
  const [platform, setPlatform] = useState<SocialPlatformType | 'ALL'>('ALL');
  const [city, setCity] = useState('');
  const [debouncedCity, setDebouncedCity] = useState('');
  const [province, setProvince] = useState('');
  const [debouncedProvince, setDebouncedProvince] = useState('');
  const [page, setPage] = useState(1);
  const [selectedCreator, setSelectedCreator] = useState<Creator | null>(null);
  const [inviteCreator, setInviteCreator] = useState<Creator | null>(null);
  const pageSize = 20;

  // Debounce search input (500ms delay)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1); // Reset to first page when search changes
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  // Debounce mainNiche input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedMainNiche(mainNiche);
      setPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [mainNiche]);

  // Debounce city input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedCity(city);
      setPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [city]);

  // Debounce province input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedProvince(province);
      setPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [province]);

  // Update debounced values immediately when platform changes (no debounce needed for select)
  useEffect(() => {
    setPage(1);
  }, [platform]);

  const { data, isLoading, error, refetch } = useSearchCreators({
    search: debouncedSearch || undefined,
    mainNiche: debouncedMainNiche || undefined,
    platform: platform === 'ALL' ? undefined : platform,
    city: debouncedCity || undefined,
    province: debouncedProvince || undefined,
    page,
    pageSize,
  });

  const handleSearch = () => {
    // Immediately update debounced values and reset page
    setDebouncedSearch(search);
    setDebouncedMainNiche(mainNiche);
    setDebouncedCity(city);
    setDebouncedProvince(province);
    setPage(1);
  };

  const handleReset = () => {
    setSearch('');
    setDebouncedSearch('');
    setMainNiche('');
    setDebouncedMainNiche('');
    setPlatform('ALL');
    setCity('');
    setDebouncedCity('');
    setProvince('');
    setDebouncedProvince('');
    setPage(1);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-xl font-bold sm:text-2xl lg:text-3xl">Cari Creator</h1>
        <p className="text-sm text-muted-foreground mt-1 sm:mt-2 sm:text-base">
          Temukan dan undang creator untuk campaign Anda
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="text-base sm:text-lg">Filter Pencarian</CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <div className="grid gap-3 sm:gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-2">
              <label className="text-xs font-medium sm:text-sm">Cari</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Nama, niche, atau bio..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  className="pl-9 text-sm sm:text-base"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium sm:text-sm">Main Niche</label>
              <Input
                placeholder="Contoh: Fashion, Beauty..."
                value={mainNiche}
                onChange={(e) => setMainNiche(e.target.value)}
                className="text-sm sm:text-base"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium sm:text-sm">Platform</label>
              <Select
                value={platform}
                onValueChange={(value) => setPlatform(value as SocialPlatformType | 'ALL')}
              >
                <SelectTrigger className="text-sm sm:text-base">
                  <SelectValue placeholder="Semua Platform" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Semua Platform</SelectItem>
                  {platformOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium sm:text-sm">Kota</label>
              <Input
                placeholder="Contoh: Jakarta..."
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="text-sm sm:text-base"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium sm:text-sm">Provinsi</label>
              <Input
                placeholder="Contoh: DKI Jakarta..."
                value={province}
                onChange={(e) => setProvince(e.target.value)}
                className="text-sm sm:text-base"
              />
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-end gap-2 md:col-span-2 lg:col-span-1">
              <Button onClick={handleSearch} className="flex-1" size="sm">
                <Search className="mr-2 h-4 w-4" />
                Cari
              </Button>
              <Button variant="outline" onClick={handleReset} size="sm" className="sm:flex-shrink-0">
                Reset
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <div>
        {isLoading ? (
          <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : error ? (
          <ErrorState
            title="Gagal memuat creators"
            description="Terjadi kesalahan saat memuat data creators."
            onRetry={() => refetch()}
          />
        ) : data && data.data.length > 0 ? (
          <>
            <div className="mb-3 text-xs text-muted-foreground sm:mb-4 sm:text-sm">
              Menampilkan {data.data.length} dari {data.total} creator
            </div>
            <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {data.data.map((creator) => (
                <CreatorCard
                  key={creator.id}
                  creator={creator}
                  onViewProfile={() => setSelectedCreator(creator)}
                  onInvite={() => setInviteCreator(creator)}
                />
              ))}
            </div>

            {/* Pagination */}
            {data.total > pageSize && (
              <div className="mt-4 flex flex-col items-center gap-2 sm:mt-6 sm:flex-row sm:justify-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="w-full sm:w-auto"
                >
                  Sebelumnya
                </Button>
                <span className="text-xs text-muted-foreground sm:text-sm">
                  Halaman {page} dari {Math.ceil(data.total / pageSize)}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => p + 1)}
                  disabled={page >= Math.ceil(data.total / pageSize)}
                  className="w-full sm:w-auto"
                >
                  Selanjutnya
                </Button>
              </div>
            )}
          </>
        ) : (
          <EmptyState
            icon={Search}
            title="Tidak ada creator ditemukan"
            description="Coba ubah filter pencarian Anda."
          />
        )}
      </div>

      {/* Modals */}
      {selectedCreator && (
        <CreatorProfileModal
          creatorId={selectedCreator.id}
          open={!!selectedCreator}
          onOpenChange={(open) => !open && setSelectedCreator(null)}
        />
      )}

      {inviteCreator && (
        <InviteCreatorDialog
          creator={inviteCreator}
          open={!!inviteCreator}
          onOpenChange={(open) => !open && setInviteCreator(null)}
        />
      )}
    </div>
  );
}

interface CreatorCardProps {
  creator: Creator;
  onViewProfile: () => void;
  onInvite: () => void;
}

function CreatorCard({ creator, onViewProfile, onInvite }: CreatorCardProps) {
  const primaryPlatform = creator.platforms.find((p) => p.isPrimary) || creator.platforms[0];

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-start gap-3 sm:gap-4">
          <Avatar className="h-10 w-10 flex-shrink-0 sm:h-12 sm:w-12">
            <AvatarImage src={creator.avatarUrl} alt={creator.displayName} />
            <AvatarFallback className="text-xs sm:text-sm">
              {creator.displayName
                .split(' ')
                .map((n) => n[0])
                .join('')
                .toUpperCase()
                .slice(0, 2)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-sm truncate sm:text-base">{creator.displayName}</h3>
              {creator.verificationStatus === 'SOCIAL_VERIFIED' && (
                <CheckCircle2 className="h-3.5 w-3.5 text-primary flex-shrink-0 sm:h-4 sm:w-4" />
              )}
            </div>
            {creator.bio && (
              <p className="text-xs text-muted-foreground line-clamp-2 mt-1 sm:text-sm">{creator.bio}</p>
            )}
            {primaryPlatform && (
              <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground sm:text-sm">
                <Users className="h-3 w-3 flex-shrink-0" />
                <span className="truncate">{primaryPlatform.followers.toLocaleString('id-ID')} followers</span>
                {primaryPlatform.handle && (
                  <span className="text-primary truncate hidden sm:inline">@{primaryPlatform.handle}</span>
                )}
              </div>
            )}
            {primaryPlatform?.handle && (
              <div className="mt-1 text-xs text-primary sm:hidden">
                @{primaryPlatform.handle}
              </div>
            )}
            {creator.mainNiche && (
              <div className="mt-2">
                <Badge variant="secondary" className="text-xs">{creator.mainNiche}</Badge>
              </div>
            )}
            <div className="mt-3 flex gap-2 sm:mt-4">
              <Button variant="outline" size="sm" onClick={onViewProfile} className="flex-1 text-xs sm:text-sm">
                Lihat Profil
              </Button>
              <Button size="sm" onClick={onInvite} className="flex-1 text-xs sm:text-sm">
                Undang
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

