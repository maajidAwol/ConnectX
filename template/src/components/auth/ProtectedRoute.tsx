'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuthStore } from 'src/store/auth';
import ClientAuthProvider from './ClientAuthProvider';

type Props = {
  children: React.ReactNode;
};

export default function ProtectedRoute({ children }: Props) {
  return (
    <ClientAuthProvider>
      <ProtectedRouteContent>{children}</ProtectedRouteContent>
    </ClientAuthProvider>
  );
}

function ProtectedRouteContent({ children }: Props) {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuthStore();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      const currentPath = router.asPath;
      router.replace({
        pathname: '/auth/login-illustration',
        query: { from: currentPath },
      });
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return null; // or a loading spinner
  }

  return isAuthenticated ? <>{children}</> : null;
}
