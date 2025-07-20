'use client';

import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { getLoggedInUser, isAdminForCurrentOrg } from '@/lib/utils';

export default function RouteGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const params = useParams();
  const org = typeof params?.org === 'string' ? params.org : undefined;

  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    const user = getLoggedInUser();

    if (!user || !org) {
      router.replace('/');
      return;
    }

    const isAdminUser = isAdminForCurrentOrg(org);
    setIsAdmin(isAdminUser);

    if (!isAdminUser) {
      toast.error('You are not an admin for this organization.');
      router.replace(`/${org}/status`);
    }
  }, [router, org]);

  if (isAdmin === false || isAdmin === null) return null;

  return children;
}
