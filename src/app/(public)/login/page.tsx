'use client';

import { useState, useEffect } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AuthCard } from '@/components/auth/AuthCard';
import { routes } from '@/lib/config/routes';
import Link from 'next/link';

const loginSchema = z.object({
  email: z.string().email('Email tidak valid'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (status === 'authenticated' && session?.user?.role) {
      const role = session.user.role;
      const hasProfile = session.hasProfile ?? 0;
      
      // Check if there's a callbackUrl from OAuth redirect
      const urlParams = new URLSearchParams(window.location.search);
      const callbackUrl = urlParams.get('callbackUrl');
      
      // Small delay to ensure session is fully loaded
      const timer = setTimeout(() => {
        // If callbackUrl is set (from OAuth redirect), use it
        if (callbackUrl) {
          try {
            const decodedUrl = decodeURIComponent(callbackUrl);
            // Only allow redirects to onboarding pages or dashboards
            if (
              decodedUrl.includes('/brand/onboarding') ||
              decodedUrl.includes('/creator/onboarding') ||
              decodedUrl.includes('/brand/dashboard') ||
              decodedUrl.includes('/creator/dashboard') ||
              decodedUrl.includes('/admin/dashboard')
            ) {
              router.replace(decodedUrl);
              // Clean up URL params
              window.history.replaceState({}, '', '/login');
              return;
            }
          } catch (err) {
            console.error('Invalid callbackUrl:', err);
          }
        }
        
        // Use hasProfile from backend to determine redirect
        if (hasProfile === 0) {
          // User doesn't have profile, redirect to onboarding
          if (role === 'BRAND') {
            router.replace(routes.brand.onboarding);
          } else if (role === 'CREATOR') {
            router.replace(routes.creator.onboarding);
          } else {
            // ADMIN doesn't need onboarding
            router.replace(routes.admin.dashboard);
          }
        } else {
          // User has profile, redirect to dashboard based on actual role
          if (role === 'BRAND') {
            router.replace(routes.brand.dashboard);
          } else if (role === 'CREATOR') {
            router.replace(routes.creator.dashboard);
          } else if (role === 'ADMIN') {
            router.replace(routes.admin.dashboard);
          }
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [session, status, router]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await signIn('credentials', {
        redirect: false,
        email: data.email,
        password: data.password,
      });

      if (result?.error) {
        setError(result.error);
        setIsLoading(false);
        return;
      }

      if (result?.ok) {
        // Get session to determine redirect based on hasProfile
        const session = await fetch('/api/auth/session').then((res) => res.json());
        const role = session?.user?.role;
        const hasProfile = session?.hasProfile ?? 0;

        if (hasProfile === 0) {
          // User doesn't have profile, redirect to onboarding
          if (role === 'BRAND') {
            router.push(routes.brand.onboarding);
          } else if (role === 'CREATOR') {
            router.push(routes.creator.onboarding);
          } else {
            router.push(routes.admin.dashboard);
          }
        } else {
          // User has profile, redirect to dashboard
          if (role === 'BRAND') {
            router.push(routes.brand.dashboard);
          } else if (role === 'CREATOR') {
            router.push(routes.creator.dashboard);
          } else if (role === 'ADMIN') {
            router.push(routes.admin.dashboard);
          } else {
            router.push('/');
          }
        }
      }
    } catch (err) {
      setError('Terjadi kesalahan. Silakan coba lagi.');
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted p-4">
      <AuthCard title="Welcome back 👋" description="Masuk ke akun Anda">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="nama@email.com"
              {...register('email')}
              disabled={isLoading}
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              {...register('password')}
              disabled={isLoading}
            />
            {errors.password && (
              <p className="text-sm text-destructive">{errors.password.message}</p>
            )}
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Memproses...' : 'Login'}
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">atau</span>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => {
              // Redirect will be handled by NextAuth redirect callback based on role
              signIn('google', { 
                redirect: true,
                callbackUrl: '/login', // Will be overridden by redirect callback if user has role
              });
            }}
            disabled={isLoading}
          >
            <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Login dengan Google
          </Button>

          <div className="text-center text-sm">
            <span className="text-muted-foreground">Belum punya akun? </span>
            <Link href={routes.register.brand} className="text-primary hover:underline">
              Daftar sebagai Brand
            </Link>
            <span className="text-muted-foreground"> atau </span>
            <Link href={routes.register.creator} className="text-primary hover:underline">
              Creator
            </Link>
          </div>
        </form>
      </AuthCard>
    </div>
  );
}

