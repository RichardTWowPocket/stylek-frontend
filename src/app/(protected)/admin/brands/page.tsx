'use client';

import { useAdminBrands } from '@/lib/hooks/admin/useAdminBrands';
import { useAdminBrandsStore } from '@/store/adminBrands.store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { SkeletonCard } from '@/components/common/SkeletonCard';
import { ErrorState } from '@/components/common/ErrorState';
import { EmptyState } from '@/components/common/EmptyState';
import { Search, Building2, Eye } from 'lucide-react';
import { routes } from '@/lib/config/routes';
import Link from 'next/link';
import { formatDateTimeShort } from '@/lib/utils/formatDate';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

function getStatusBadgeVariant(status: string) {
  return status === 'VERIFIED' ? 'default' : 'secondary';
}

export default function AdminBrandsPage() {
  const { status, search, setStatus, setSearch } = useAdminBrandsStore();
  const { data, isLoading, error, refetch } = useAdminBrands();

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
        title="Gagal memuat brands"
        description="Terjadi kesalahan saat memuat daftar brand."
        onRetry={() => refetch()}
      />
    );
  }

  const brands = data?.data || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Brand Management</h1>
        <p className="text-muted-foreground">Kelola verifikasi dan data brand</p>
      </div>

      {/* Filter Bar */}
      <Card className="p-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Cari brand name atau email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
          <Select value={status} onValueChange={(value) => setStatus(value as any)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Semua</SelectItem>
              <SelectItem value="VERIFIED">Verified</SelectItem>
              <SelectItem value="UNVERIFIED">Unverified</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Brands List */}
      {brands.length === 0 ? (
        <EmptyState
          icon={Building2}
          title="Belum ada brand"
          description={
            search || status !== 'ALL'
              ? 'Tidak ada brand yang sesuai dengan filter Anda.'
              : 'Belum ada brand yang terdaftar.'
          }
        />
      ) : (
        <div className="space-y-2">
          {brands.map((brand) => (
            <Card key={brand.id} className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {brand.logoUrl && (
                    <img
                      src={brand.logoUrl}
                      alt={brand.name}
                      className="h-12 w-12 rounded-lg object-cover"
                    />
                  )}
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{brand.name}</h3>
                      <Badge variant={getStatusBadgeVariant(brand.verificationStatus)}>
                        {brand.verificationStatus}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{brand.ownerEmail}</p>
                    <div className="mt-1 flex flex-wrap gap-4 text-sm text-muted-foreground">
                      {brand.city && brand.province && (
                        <span>
                          {brand.city}, {brand.province}
                        </span>
                      )}
                      <span>{formatDateTimeShort(brand.createdAt)}</span>
                    </div>
                  </div>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link href={routes.admin.brandDetail(brand.id)}>
                    <Eye className="mr-2 h-4 w-4" />
                    Detail
                  </Link>
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

