'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { AppSidebar } from '@/components/layout/AppSidebar';
import { AppTopbar } from '@/components/layout/AppTopbar';
import { AppBottomNav } from '@/components/layout/AppBottomNav';
import { creatorNavItems } from '@/lib/config/nav';
import { routes } from '@/lib/config/routes';
import { useUiStore } from '@/store/ui.store';
import { cn } from '@/utils/cn';

export default function CreatorLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { sidebarOpen } = useUiStore();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push(routes.login);
    } else if (status === 'authenticated' && session?.user?.role !== 'CREATOR') {
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

  if (status === 'unauthenticated' || session?.user?.role !== 'CREATOR') {
    return null;
  }

  return (
    <div className="flex min-h-screen">
      <AppSidebar items={creatorNavItems} />
      <div className={cn(
        'flex flex-1 flex-col transition-all',
        sidebarOpen && 'lg:ml-64'
      )}>
        <AppTopbar />
        <main className="flex-1 p-4 sm:p-6 pb-20 lg:pb-6">{children}</main>
        <AppBottomNav items={creatorNavItems} />
      </div>
    </div>
  );
}

