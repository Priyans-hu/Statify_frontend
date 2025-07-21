'use client';

import { usePathname } from 'next/navigation';
import RouteGuard from '../components/routeGuard';

export default function RouteGuardWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const excludedPaths = ['/status', '/', '/incidents/all'];
  const isExcluded = excludedPaths.some((path) => pathname.endsWith(path));

  if (isExcluded) {
    return <>{children}</>;
  }

  return <RouteGuard>{children}</RouteGuard>;
}
