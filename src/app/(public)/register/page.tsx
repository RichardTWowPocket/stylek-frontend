'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { registerBrand, registerCreator, type RegisterBrandDto, type RegisterCreatorDto } from '@/lib/api/auth';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { routes } from '@/lib/config/routes';
import Link from 'next/link';

const registerSchema = z.object({
  email: z.string().email('Email tidak valid'),
  password: z.string().min(8, 'Password minimal 8 karakter'),
});

type RegisterFormData = z.infer<typeof registerSchema>;

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<'brand' | 'creator'>('brand');

  // Handle query param for tab
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam === 'brand' || tabParam === 'creator') {
      setActiveTab(tabParam);
    }
  }, [searchParams]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      let response;
      if (activeTab === 'brand') {
        response = await registerBrand(data as RegisterBrandDto);
      } else {
        response = await registerCreator(data as RegisterCreatorDto);
      }

      const hasProfile = response.hasProfile ?? 0;
      
      // Auto login after registration
      const signInResult = await signIn('credentials', {
        redirect: false,
        email: data.email,
        password: data.password,
      });

      if (signInResult?.ok) {
        // Redirect based on hasProfile
        if (hasProfile === 0) {
          if (activeTab === 'brand') {
            router.push(routes.brand.onboarding);
          } else {
            router.push(routes.creator.onboarding);
          }
        } else {
          if (activeTab === 'brand') {
            router.push(routes.brand.dashboard);
          } else {
            router.push(routes.creator.dashboard);
          }
        }
      } else {
        // If auto login fails, redirect to login page
        router.push(routes.login);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registrasi gagal. Silakan coba lagi.');
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    if (activeTab === 'brand') {
      document.cookie = `nextauth_intended_role=BRAND; path=/; max-age=300; SameSite=Lax`;
      signIn('google', { 
        redirect: true, 
        callbackUrl: '/brand/onboarding' 
      });
    } else {
      document.cookie = `nextauth_intended_role=CREATOR; path=/; max-age=300; SameSite=Lax`;
      signIn('google', { 
        redirect: true, 
        callbackUrl: '/creator/onboarding' 
      });
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Register Form */}
      <div className="flex-1 flex items-center justify-center bg-background p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-md space-y-8">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-lg bg-[#6c74ab] flex items-center justify-center">
              <span className="text-white font-bold text-xl">S</span>
            </div>
            <span className="text-2xl font-bold text-foreground">StyleK</span>
          </div>

          {/* Header */}
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-foreground">Daftar</h1>
            <p className="text-muted-foreground">Buat akun baru untuk memulai</p>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={(value) => {
            setActiveTab(value as 'brand' | 'creator');
            setError(null);
            reset();
          }} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="brand">Brand</TabsTrigger>
              <TabsTrigger value="creator">Creator</TabsTrigger>
            </TabsList>

            {/* Brand Tab */}
            <TabsContent value="brand" className="mt-6">
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
                  {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
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
                  {isLoading ? 'Memproses...' : 'Daftar sebagai Brand'}
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
                  onClick={handleGoogleSignIn}
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
                  Daftar sebagai Brand dengan Google
                </Button>

                <div className="text-center text-sm">
                  <span className="text-muted-foreground">Sudah punya akun? </span>
                  <Link href={routes.login} className="text-primary hover:underline">
                    Login
                  </Link>
                </div>
              </form>
            </TabsContent>

            {/* Creator Tab */}
            <TabsContent value="creator" className="mt-6">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email-creator">Email</Label>
                  <Input 
                    id="email-creator" 
                    type="email" 
                    placeholder="nama@email.com"
                    {...register('email')} 
                    disabled={isLoading} 
                  />
                  {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password-creator">Password</Label>
                  <Input 
                    id="password-creator" 
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
                  {isLoading ? 'Memproses...' : 'Daftar sebagai Creator'}
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
                  onClick={handleGoogleSignIn}
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
                  Daftar sebagai Creator dengan Google
                </Button>

                <div className="text-center text-sm">
                  <span className="text-muted-foreground">Sudah punya akun? </span>
                  <Link href={routes.login} className="text-primary hover:underline">
                    Login
                  </Link>
                </div>
              </form>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Right Side - Illustration */}
      <div className="hidden lg:flex flex-1 items-center justify-center bg-gradient-to-br from-[#FEFBF7] via-[#F5E6D3] to-[#F5C2D1]/30 p-8">
        <div className="w-full max-w-2xl">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/hero-section1.png"
            alt="StyleK - Kolaborasi Brand dan Creator"
            className="w-full h-auto object-contain"
            loading="eager"
          />
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Memuat...</p>
        </div>
      </div>
    }>
      <RegisterForm />
    </Suspense>
  );
}

