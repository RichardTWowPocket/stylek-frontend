'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useBrandOnboardingStore } from '@/store/brandOnboarding.store';
import { BrandOnboardingStep1 } from '@/components/brand/BrandOnboardingStep1';
import { BrandOnboardingStep2 } from '@/components/brand/BrandOnboardingStep2';
import { Card } from '@/components/ui/card';
import { routes } from '@/lib/config/routes';

export default function BrandOnboardingPage() {
  const { step, setStep } = useBrandOnboardingStore();
  const router = useRouter();
  const { data: session, status } = useSession();
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/login');
    }
  }, [status, router]);
  
  // Show loading while checking session
  if (status === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }
  
  // Don't render if not authenticated (will redirect)
  if (status === 'unauthenticated') {
    return null;
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Stepper */}
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${
                  step >= 1
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border text-muted-foreground'
                }`}
              >
                {step > 1 ? '✓' : '1'}
              </div>
              <span className={step >= 1 ? 'font-medium' : 'text-muted-foreground'}>
                Informasi Dasar
              </span>
            </div>
            <div className="h-0.5 w-12 bg-border" />
            <div className="flex items-center gap-2">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${
                  step >= 2
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border text-muted-foreground'
                }`}
              >
                2
              </div>
              <span className={step >= 2 ? 'font-medium' : 'text-muted-foreground'}>
                Channels
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* Step Content */}
      {step === 1 && <BrandOnboardingStep1 onNext={() => setStep(2)} />}
      {step === 2 && (
        <BrandOnboardingStep2
          onBack={() => setStep(1)}
          onComplete={() => {
            // After completing onboarding, refresh session and redirect to dashboard
            // Force page reload to refresh session with updated hasProfile
            window.location.href = routes.brand.dashboard;
          }}
        />
      )}
    </div>
  );
}

