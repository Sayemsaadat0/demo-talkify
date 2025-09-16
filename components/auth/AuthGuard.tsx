'use client';

import React, { useEffect, useState, memo } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { RootState } from '@/redux/store';

interface AuthGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  redirectTo?: string;
}

const AuthGuard: React.FC<AuthGuardProps> = memo(({ 
  children, 
  fallback,
  redirectTo = '/login' 
}) => {
  const { isAuthenticated, token } = useSelector((state: RootState) => state.auth);
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Small delay to prevent flash of content
    const timer = setTimeout(() => {
      if (!isAuthenticated || !token) {
        router.replace(redirectTo);
      } else {
        setIsChecking(false);
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [isAuthenticated, token, router, redirectTo]);

  // Show loading state while checking authentication
  if (isChecking || !isAuthenticated || !token) {
    return fallback || (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
});

AuthGuard.displayName = 'AuthGuard';

export default AuthGuard;
