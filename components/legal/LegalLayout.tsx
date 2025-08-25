'use client';

import Link from 'next/link';
import { ReactNode } from 'react';

interface LegalLayoutProps {
  children: ReactNode;
  title: string;
  lastUpdated: string;
}

export default function LegalLayout({ children, title, lastUpdated }: LegalLayoutProps) {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-900">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/" 
            className="inline-flex items-center text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 mb-4"
          >
            ← Back to Home
          </Link>
          
          {/* Dog Log Logo */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-3 mb-4">
              <img src="/doglog-logo.png" alt="Dog Log Logo" className="h-12 w-12 rounded-full shadow" />
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dog Log</h1>
            </div>
          </div>

          <div className="text-center">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">{title}</h2>
            <p className="text-gray-600 dark:text-gray-400">Last updated: {lastUpdated}</p>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
          <div className="prose prose-gray dark:prose-invert max-w-none">
            {children}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <div className="flex justify-center space-x-6 text-sm text-gray-600 dark:text-gray-400">
            <Link href="/terms" className="hover:text-indigo-600 dark:hover:text-indigo-400">
              Terms of Service
            </Link>
            <Link href="/privacy" className="hover:text-indigo-600 dark:hover:text-indigo-400">
              Privacy Policy
            </Link>
            <a 
              href="mailto:logdogtracker+android@gmail.com" 
              className="hover:text-indigo-600 dark:hover:text-indigo-400"
            >
              Contact Us
            </a>
          </div>
          
          {/* Legal Footer Notice */}
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              By using Dog Log Tracker, you agree to our{' '}
              <Link href="/terms" className="underline hover:text-indigo-600 dark:hover:text-indigo-400">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link href="/privacy" className="underline hover:text-indigo-600 dark:hover:text-indigo-400">
                Privacy Policy
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}