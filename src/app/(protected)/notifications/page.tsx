'use client';

import { useState } from 'react';
import { useNotifications, useMarkAllNotificationsRead } from '@/lib/hooks/useNotifications';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/common/EmptyState';
import { SkeletonCard } from '@/components/common/SkeletonCard';
import { ErrorState } from '@/components/common/ErrorState';
import { Bell, CheckCheck } from 'lucide-react';
import { toast } from '@/lib/ui/toast';

export default function NotificationsPage() {
  const [page, setPage] = useState(1);
  const pageSize = 20;

  const { data, isLoading, error, refetch } = useNotifications({ page, pageSize });
  const markAllRead = useMarkAllNotificationsRead();

  const handleMarkAllRead = async () => {
    try {
      await markAllRead.mutateAsync();
      toast.success('Semua notifikasi ditandai sudah dibaca');
    } catch (err) {
      toast.error('Gagal menandai semua notifikasi');
    }
  };

  const getTypeBadgeVariant = (type: string) => {
    switch (type) {
      case 'CAMPAIGN':
        return 'default';
      case 'WALLET':
        return 'default';
      case 'SYSTEM':
        return 'secondary';
      default:
        return 'default';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Baru saja';
    if (diffMins < 60) return `${diffMins} menit yang lalu`;
    if (diffHours < 24) return `${diffHours} jam yang lalu`;
    if (diffDays < 7) return `${diffDays} hari yang lalu`;

    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Notifikasi</h1>
        </div>
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Notifikasi</h1>
        </div>
        <ErrorState
          title="Gagal memuat notifikasi"
          description="Terjadi kesalahan saat memuat notifikasi. Silakan coba lagi."
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  const notifications = data?.data || [];
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Notifikasi</h1>
        {unreadCount > 0 && (
          <Button
            variant="outline"
            onClick={handleMarkAllRead}
            disabled={markAllRead.isPending}
          >
            <CheckCheck className="mr-2 h-4 w-4" />
            Tandai semua sudah dibaca
          </Button>
        )}
      </div>

      {notifications.length === 0 ? (
        <EmptyState
          icon={Bell}
          title="Belum ada notifikasi"
          description="Anda belum memiliki notifikasi saat ini."
        />
      ) : (
        <div className="space-y-2">
          {notifications.map((notification) => (
            <Card
              key={notification.id}
              className={`p-4 transition-colors hover:bg-muted/50 ${
                !notification.isRead ? 'bg-muted/30' : ''
              }`}
            >
              <div className="flex items-start gap-3">
                {!notification.isRead && (
                  <div className="mt-1.5 h-2 w-2 rounded-full bg-primary" />
                )}
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">{notification.title}</h3>
                    <Badge variant={getTypeBadgeVariant(notification.type)}>
                      {notification.type}
                    </Badge>
                  </div>
                  {notification.body && (
                    <p className="text-sm text-muted-foreground">{notification.body}</p>
                  )}
                  <p className="text-xs text-muted-foreground">{formatDate(notification.createdAt)}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {data && data.total > page * pageSize && (
        <div className="flex justify-center">
          <Button variant="outline" onClick={() => setPage(page + 1)}>
            Muat lebih banyak
          </Button>
        </div>
      )}
    </div>
  );
}

