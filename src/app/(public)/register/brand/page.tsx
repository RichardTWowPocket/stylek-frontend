'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterBrandPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/register?tab=brand');
  }, [router]);

  return null;
}

