'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { routes } from '@/lib/config/routes';
import { LoginRoleModal } from './LoginRoleModal';

export function LandingHeader() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-[#6c74ab] flex items-center justify-center">
                <span className="text-white font-bold text-lg">S</span>
              </div>
              <span className="text-xl font-bold">StyleK</span>
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              <Link
                href="#features"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Fitur
              </Link>
            </nav>

            {/* CTA Buttons */}
            <div className="flex items-center space-x-4">
              <Button
                asChild
                variant="ghost"
                className="hidden sm:inline-flex"
              >
                <Link href={routes.login}>Masuk</Link>
              </Button>
              <Button
                className="rounded-xl"
                onClick={() => setIsLoginModalOpen(true)}
              >
                Daftar Sekarang!
              </Button>
            </div>
          </div>
        </div>
      </header>
      <LoginRoleModal open={isLoginModalOpen} onOpenChange={setIsLoginModalOpen} />
    </>
  );
}

