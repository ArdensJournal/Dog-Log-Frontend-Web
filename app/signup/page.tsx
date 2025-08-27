'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { apiClient } from '../lib/api-client';
import { notifyAuthStateChanged } from '../lib/auth';

export default function SignUpPage() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false); // ✅ New state for terms acceptance
  const [error, setError] = useState('');
  const [googleLoading, setGoogleLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    
    // Validate terms acceptance
    if (!acceptTerms) {
      setError('You must accept the Terms of Service and Privacy Policy to create an account.');
      return;
    }
    
    if (password !== repeatPassword) {
      setError('Passwords do not match');
      return;
    }
    
    try {
      const result = await apiClient.signup(name, email, password, acceptTerms);
      
      if (result.user) {
        // Notify all components about the auth state change
        notifyAuthStateChanged();
        router.push('/');
      } else {
        setError('Sign up failed');
      }
    } catch (error: any) {
      setError(error.message || 'Sign up failed');
    }
  }

  // Environment-aware Google OAuth
  function handleGoogleAuth() {
    // Validate terms acceptance for Google OAuth too
    if (!acceptTerms) {
      setError('You must accept the Terms of Service and Privacy Policy to create an account.');
      return;
    }
    
    setGoogleLoading(true);
    console.log('🚀 Redirecting to Google OAuth...');
    
    // Check if we're in development or production
    const isDevelopment = process.env.NODE_ENV === 'development';
    
    let oauthUrl;
    if (isDevelopment) {
      // Local development: Use port 3456 (your backend port)
      oauthUrl = 'http://localhost:3456/auth/callback/google';
    } else {
      // Production: Use your existing working setup
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL!.replace('/graphql', '');
      oauthUrl = `${backendUrl}/auth/callback/google`;
    }
    
    console.log('📍 OAuth URL:', oauthUrl);
    console.log('🌍 Environment:', isDevelopment ? 'Development' : 'Production');
    window.location.href = oauthUrl;
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 via-white to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-900 p-8">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-indigo-700 dark:text-indigo-400 mb-4 text-center">Create Your Dog Log Account</h1>
        
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            required
          />
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={e => setName(e.target.value)}
            className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            required
          />
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            required
          />
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Repeat Password"
            value={repeatPassword}
            onChange={e => setRepeatPassword(e.target.value)}
            className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            required    
          />
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="showPassword"
              checked={showPassword}
              onChange={() => setShowPassword(!showPassword)}
            />
            <label htmlFor="showPassword" className="text-gray-700 dark:text-gray-300 text-sm">Show Password</label>
          </div>
          
          {/* Terms acceptance checkbox */}
          <div className="flex items-start gap-2 mt-2">
            <input
              type="checkbox"
              id="acceptTerms"
              checked={acceptTerms}
              onChange={(e) => setAcceptTerms(e.target.checked)}
              className="mt-1 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              required
            />
            <label htmlFor="acceptTerms" className="text-gray-700 dark:text-gray-300 text-sm">
              I agree to the{' '}
              <Link href="/terms" className="text-indigo-600 dark:text-indigo-400 hover:underline font-semibold">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link href="/privacy" className="text-indigo-600 dark:text-indigo-400 hover:underline font-semibold">
                Privacy Policy
              </Link>
            </label>
          </div>
          
          <button
            type="submit"
            disabled={!acceptTerms}
            className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-bold py-2 rounded-lg shadow transition"
          >
            Sign Up
          </button>
        </form>

        {/* Google Authentication Section */}
        <div className="text-center">
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 dark:border-gray-600" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white dark:bg-gray-800 text-gray-500">Or continue with</span>
            </div>
          </div>
          
          <button
            type="button"
            onClick={handleGoogleAuth}
            disabled={googleLoading || !acceptTerms}
            className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm bg-white dark:bg-gray-700 text-sm font-medium text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            {googleLoading ? 'Redirecting to Google...' : 'Continue with Google'}
          </button>
        </div>

        {error && <div className="text-red-500 dark:text-red-400 text-center mt-4">{error}</div>}
        
        <p className="mt-4 text-center text-gray-600 dark:text-gray-400">
          Already have an account?{' '}
          <Link href="/signin" className="text-indigo-500 dark:text-indigo-400 underline font-semibold">
            Sign In
          </Link>
        </p>
      </div>
    </main>
  );
}