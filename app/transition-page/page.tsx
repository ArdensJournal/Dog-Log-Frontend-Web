'use client';
import { Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function TransitionPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const accessToken = searchParams.get('accessToken');
    const refreshToken = searchParams.get('refreshToken');
    const error = searchParams.get('error');
    
    console.log('🔄 Transition page loaded');
    console.log('📄 URL params:', window.location.search);
    
    if (error) {
      console.error('❌ Google OAuth error:', error);
      router.push('/signin?error=google_auth_failed');
      return;
    }
    
    if (accessToken && refreshToken) {
      console.log('✅ Tokens received successfully');
      console.log('🔑 Access token:', accessToken.substring(0, 50) + '...');
      console.log('🔄 Refresh token:', refreshToken.substring(0, 50) + '...');
      
      // Store tokens in localStorage
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      
      console.log('💾 Tokens stored in localStorage');
      
      // Redirect to main dashboard
      router.push('/');
    } else {
      console.error('❌ Missing tokens in transition page');
      console.log('🔍 Available params:', Array.from(searchParams.entries()));
      router.push('/signin?error=missing_tokens');
    }
  }, [router, searchParams]);

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-900">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
        <p className="text-gray-600 dark:text-gray-400">Completing Google authentication...</p>
        <p className="text-sm text-gray-400 mt-2">You'll be redirected shortly</p>
      </div>
    </main>
  );
}

export default function TransitionPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </main>
    }>
      <TransitionPageContent />
    </Suspense>
  );
}