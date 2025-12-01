'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/utils/cn';
import { useUiStore } from '@/store/ui.store';

export interface SidebarItem {
  icon: LucideIcon;
  label: string;
  href: string;
}

interface AppSidebarProps {
  items: SidebarItem[];
}

export function AppSidebar({ items }: AppSidebarProps) {
  const pathname = usePathname();
  const { sidebarOpen } = useUiStore();

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 h-screen border-r border-border bg-background transition-transform',
        'hidden lg:block',
        sidebarOpen ? 'w-64 translate-x-0' : '-translate-x-full'
      )}
    >
      <div className="flex h-full flex-col gap-4 p-4">
        <div className="px-3 py-2">
          <h2 className="text-lg font-semibold">StyleK</h2>
        </div>
        <nav className="flex-1 space-y-1">
          {items.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )}
              >
                <Icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}

