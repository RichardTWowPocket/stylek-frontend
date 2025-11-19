import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useBrandProfile } from './useBrand';
import { routes } from '@/lib/config/routes';

/**
 * Hook to ensure brand profile is complete before accessing protected routes
 * Redirects to onboarding if profile is incomplete
 */
export function useEnsureBrandProfile() {
  const router = useRouter();
  const pathname = usePathname();
  const { data: profile, isLoading, error } = useBrandProfile();

  useEffect(() => {
    // Skip check for onboarding page to avoid redirect loop
    if (pathname === routes.brand.onboarding) {
      return;
    }

    if (isLoading) {
      return;
    }

    // Handle auth errors
    if (error) {
      const status = (error as any)?.response?.status;
      if (status === 401 || status === 403) {
        router.push(routes.login);
        return;
      }
      // 404 means brand profile doesn't exist yet
      if (status === 404) {
        router.push(routes.brand.onboarding);
        return;
      }
    }

    // Check if profile is complete
    if (profile) {
      const isProfileComplete = checkProfileComplete(profile);
      if (!isProfileComplete) {
        router.push(routes.brand.onboarding);
      }
    }
  }, [profile, isLoading, error, pathname, router]);

  return {
    profile,
    isLoading,
    error,
    isProfileComplete: profile ? checkProfileComplete(profile) : false,
  };
}

/**
 * Check if brand profile has all required fields filled
 */
function checkProfileComplete(profile: {
  name?: string;
  category?: string;
  city?: string;
  province?: string;
}): boolean {
  // Required fields: name, category, city, province
  return !!(
    profile.name &&
    profile.category &&
    profile.city &&
    profile.province
  );
}

