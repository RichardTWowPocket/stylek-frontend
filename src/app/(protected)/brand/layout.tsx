'use client';

import { useSession } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { AppSidebar } from '@/components/layout/AppSidebar';
import { AppTopbar } from '@/components/layout/AppTopbar';
import { BrandProfileGate } from '@/components/brand/BrandProfileGate';
import { brandNavItems } from '@/lib/config/nav';
import { routes } from '@/lib/config/routes';
import { useUiStore } from '@/store/ui.store';
import { cn } from '@/utils/cn';

export default function BrandLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const { sidebarOpen } = useUiStore();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push(routes.login);
    } else if (status === 'authenticated' && session?.user?.role !== 'BRAND') {
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

  if (status === 'unauthenticated' || session?.user?.role !== 'BRAND') {
    return null;
  }

  // Skip sidebar/topbar for onboarding page
  const isOnboardingPage = pathname === routes.brand.onboarding;

  return (
    <div className="flex min-h-screen">
      {!isOnboardingPage && <AppSidebar items={brandNavItems} />}
      <div className={cn('flex flex-1 flex-col transition-all', sidebarOpen && !isOnboardingPage && 'ml-64')}>
        {!isOnboardingPage && <AppTopbar />}
        <main className="flex-1 p-6">
          {isOnboardingPage ? (
            children
          ) : (
            <BrandProfileGate>{children}</BrandProfileGate>
          )}
        </main>
      </div>
    </div>
  );
}

