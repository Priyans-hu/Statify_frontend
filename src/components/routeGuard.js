'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { getLoggedInUser } from '../lib/utils';

export default function RouteGuard({ children }) {
  const router = useRouter();
  useEffect(() => {
    const user = getLoggedInUser();
    if (!user) {
      router.replace('/');
    }
  }, [router]);
  return children;
}
