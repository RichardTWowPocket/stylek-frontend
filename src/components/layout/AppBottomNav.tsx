'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/utils/cn';

export interface BottomNavItem {
  icon: LucideIcon;
  label: string;
  href: string;
}

interface AppBottomNavProps {
  items: BottomNavItem[];
}

export function AppBottomNav({ items }: AppBottomNavProps) {
  const pathname = usePathname();

  // Determine grid columns based on number of items
  const getGridCols = () => {
    if (items.length <= 3) return 'grid-cols-3';
    if (items.length <= 4) return 'grid-cols-4';
    if (items.length <= 5) return 'grid-cols-5';
    return 'grid-cols-6';
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background shadow-lg safe-area-inset-bottom lg:hidden">
      <div className={`grid ${getGridCols()} gap-1 px-1 py-1.5`}>
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center gap-0.5 rounded-lg px-1 py-1.5 text-[10px] font-medium transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground active:bg-muted active:text-foreground'
              )}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              <span className="truncate text-[10px] leading-tight max-w-full px-0.5">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

