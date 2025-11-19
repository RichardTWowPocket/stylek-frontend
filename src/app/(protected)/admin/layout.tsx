'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { AppSidebar } from '@/components/layout/AppSidebar';
import { AppTopbar } from '@/components/layout/AppTopbar';
import { adminNavItems } from '@/lib/config/nav';
import { routes } from '@/lib/config/routes';
import { useUiStore } from '@/store/ui.store';
import { cn } from '@/utils/cn';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { sidebarOpen } = useUiStore();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push(routes.login);
    } else if (status === 'authenticated' && session?.user?.role !== 'ADMIN') {
      router.push(routes.forbidden);
    }
  }, [status, session, router]);

  if (status === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (status === 'unauthenticated' || session?.user?.role !== 'ADMIN') {
    return null;
  }

  return (
    <div className="flex min-h-screen">
      <AppSidebar items={adminNavItems} />
      <div className={cn('flex flex-1 flex-col transition-all', sidebarOpen && 'ml-64')}>
        <AppTopbar />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}

