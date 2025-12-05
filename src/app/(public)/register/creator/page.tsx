'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterCreatorPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/register?tab=creator');
  }, [router]);

  return null;
}

