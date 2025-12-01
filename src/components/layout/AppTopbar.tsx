'use client';

import { signOut, useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { Menu, User, Settings, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useUiStore } from '@/store/ui.store';
import { NotificationBell } from './NotificationBell';
import { routes } from '@/lib/config/routes';
import Link from 'next/link';

interface AppTopbarProps {
  title?: string;
}

export function AppTopbar({ title }: AppTopbarProps) {
  const { data: session } = useSession();
  const { toggleSidebar } = useUiStore();
  const pathname = usePathname();

  // Get dynamic title from pathname if not provided
  const getPageTitle = () => {
    if (title) return title;
    if (pathname.includes('/dashboard')) return 'Dashboard';
    if (pathname.includes('/campaigns')) return 'Campaigns';
    if (pathname.includes('/wallet')) return 'Wallet';
    if (pathname.includes('/profile')) return 'Profile';
    if (pathname.includes('/verification')) return 'Verification';
    if (pathname.includes('/tasks')) return 'Tasks';
    if (pathname.includes('/notifications')) return 'Notifikasi';
    return '';
  };

  const userInitials = session?.user?.email
    ?.split('@')[0]
    .substring(0, 2)
    .toUpperCase() || 'U';

  return (
    <header className="sticky top-0 z-50 flex h-16 items-center gap-4 border-b border-border bg-background px-4 sm:px-6">
      <Button variant="ghost" size="icon" onClick={toggleSidebar} className="hidden lg:flex">
        <Menu className="h-5 w-5" />
      </Button>

      {getPageTitle() && <h1 className="text-lg font-semibold">{getPageTitle()}</h1>}

      <div className="ml-auto flex items-center gap-4">
        <NotificationBell />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarFallback>{userInitials}</AvatarFallback>
              </Avatar>
              <div className="hidden text-left text-sm md:block">
                <div className="font-medium">{session?.user?.email}</div>
                <div className="text-xs text-muted-foreground">
                  {session?.user?.role === 'BRAND' && 'Brand'}
                  {session?.user?.role === 'CREATOR' && 'Creator'}
                  {session?.user?.role === 'ADMIN' && 'Admin'}
                </div>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Akun Saya</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href={routes.accountSettings} className="flex items-center">
                <User className="mr-2 h-4 w-4" />
                <span>Profil</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={routes.accountSettings} className="flex items-center">
                <Settings className="mr-2 h-4 w-4" />
                <span>Account Settings</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => signOut({ callbackUrl: routes.login })}
              className="text-destructive focus:text-destructive"
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

