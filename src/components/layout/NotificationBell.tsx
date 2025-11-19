'use client';

import { useState } from 'react';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNotifications } from '@/lib/hooks/useNotifications';
import { useMarkNotificationRead } from '@/lib/hooks/useNotifications';
import { routes } from '@/lib/config/routes';
import Link from 'next/link';
import { cn } from '@/utils/cn';

export function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const { data: notifications } = useNotifications({ page: 1, pageSize: 10 });
  const markRead = useMarkNotificationRead();

  const unreadCount = notifications?.data?.filter((n) => !n.isRead).length || 0;
  const displayCount = unreadCount > 9 ? '9+' : unreadCount;

  const handleNotificationClick = (id: string, isRead: boolean) => {
    if (!isRead) {
      markRead.mutate(id);
    }
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className="relative"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-xs font-bold text-white">
            {displayCount}
          </span>
        )}
      </Button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-full z-50 mt-2 w-80 rounded-lg border border-border bg-background shadow-lg">
            <div className="p-4">
              <div className="mb-2 flex items-center justify-between">
                <h3 className="font-semibold">Notifikasi</h3>
                {unreadCount > 0 && (
                  <span className="text-xs text-muted-foreground">
                    {unreadCount} baru
                  </span>
                )}
              </div>
              <div className="max-h-96 space-y-2 overflow-y-auto">
                {notifications?.data && notifications.data.length > 0 ? (
                  notifications.data.slice(0, 5).map((notification) => (
                    <div
                      key={notification.id}
                      onClick={() =>
                        handleNotificationClick(notification.id, notification.isRead)
                      }
                      className={cn(
                        'cursor-pointer rounded-lg p-3 transition-colors hover:bg-muted',
                        !notification.isRead && 'bg-muted/50'
                      )}
                    >
                      <div className="flex items-start gap-2">
                        {!notification.isRead && (
                          <div className="mt-1.5 h-2 w-2 rounded-full bg-primary" />
                        )}
                        <div className="flex-1">
                          <p className="text-sm font-medium">{notification.title}</p>
                          {notification.body && (
                            <p className="text-xs text-muted-foreground line-clamp-2">
                              {notification.body}
                            </p>
                          )}
                          <p className="mt-1 text-xs text-muted-foreground">
                            {new Date(notification.createdAt).toLocaleDateString('id-ID', {
                              day: 'numeric',
                              month: 'short',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-8 text-center text-sm text-muted-foreground">
                    Belum ada notifikasi
                  </div>
                )}
              </div>
              {notifications?.data && notifications.data.length > 0 && (
                <div className="mt-4 border-t border-border pt-4">
                  <Link
                    href={routes.notifications}
                    className="block text-center text-sm text-primary hover:underline"
                    onClick={() => setIsOpen(false)}
                  >
                    Lihat semua
                  </Link>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

