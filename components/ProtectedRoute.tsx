'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { checkAuthStatus } from '@/app/lib/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  fallbackMessage?: string;
}

export default function ProtectedRoute({ children, fallbackMessage }: ProtectedRouteProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const verifyAuth = async () => {
      const { isAuthenticated: authStatus } = await checkAuthStatus();
      setIsAuthenticated(authStatus);
      setLoading(false);

      // Optional: Auto-redirect to home if not authenticated
      // if (!authStatus) {
      //   router.push('/');
      // }
    };

    verifyAuth();
  }, [router]);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Checking authentication...</p>
        </div>
      </main>
    );
  }

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-900 p-8">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="mb-6">
            <img src="/doglog-logo.png" alt="Dog Log Logo" className="h-16 w-16 rounded-full shadow mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-indigo-700 dark:text-indigo-400 mb-2">Authentication Required</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {fallbackMessage || 'You need to be signed in to access this page.'}
            </p>
          </div>
          
          <div className="space-y-4">
            <Link 
              href="/signin"
              className="block w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition"
            >
              Sign In
            </Link>
            <Link 
              href="/signup"
              className="block w-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-semibold py-3 px-6 rounded-lg transition"
            >
              Create Account
            </Link>
            <Link 
              href="/"
              className="block w-full text-indigo-600 dark:text-indigo-400 hover:underline py-2"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return <>{children}</>;
}
