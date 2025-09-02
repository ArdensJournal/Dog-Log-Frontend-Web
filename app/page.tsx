'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { apiClient } from '@/app/lib/api-client';
import { onAuthStateChanged, clearAuth } from '@/app/lib/auth';

export default function Page() {
  const [userName, setUserName] = useState('visitor');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const verifyUser = async () => {
      try {
        const result = await apiClient.getCurrentUser();
        setIsAuthenticated(result.isAuthenticated);
        
        if (result.isAuthenticated && result.user) {
          setUserName(result.user.name || result.user.email?.split('@')[0] || 'user');
        } else {
          setUserName('visitor');
        }
      } catch (error) {
        // Silently handle expected authentication failures
        setIsAuthenticated(false);
        setUserName('visitor');
      }
    };

    // Initial check
    verifyUser();
    
    // Listen for auth state changes
    const unsubscribe = onAuthStateChanged(() => {
      console.log('🔄 Auth state change detected on homepage, refreshing user info...');
      verifyUser();
    });
    
    return () => {
      unsubscribe();
    };
  }, []);

  async function handleLogout() {
    try {
      await clearAuth(); // This will notify components and clear cache
      setUserName('visitor');
      setIsAuthenticated(false);
      window.location.reload();
    } catch (error) {
      console.error('Error during logout:', error);
      // Still clear local state even if API call fails
      setUserName('visitor');
      setIsAuthenticated(false);
      window.location.reload();
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-900 flex flex-col items-center p-8">
      <header className="w-full max-w-3xl mb-10 text-center">
        <img 
          src="/doglog-logo.png"
          alt="Dog Log Logo"
          className="mx-auto mb-4 h-36 w-36 rounded-full shadow-lg"
        />
        <h1 className="text-5xl font-extrabold text-indigo-700 dark:text-indigo-400 drop-shadow-lg mb-2">Dog Log</h1>
        <p className="text-xl text-gray-700 dark:text-gray-300 mb-2">
          Hi <span className="font-semibold text-indigo-600 dark:text-indigo-400">{userName}</span>!
        </p>
        <p className="text-xl text-gray-700 dark:text-gray-300 mb-4">
          Your all-in-one dog care and tracking app.
        </p>
        <div className="flex justify-center gap-4 mt-4 mb-4">
          {!isAuthenticated && (
            <>
              <Link href="/signup" className="px-6 py-2 rounded-full bg-blue-500 text-white font-semibold shadow hover:bg-blue-600 transition">Sign Up</Link>
              <Link href="/signin" className="px-6 py-2 rounded-full bg-blue-400 text-white font-semibold shadow hover:bg-blue-500 transition">Sign In</Link>
            </>
          )}
        </div>
      </header>

      {/* Only show these sections if signed in */}
      {isAuthenticated && (
        <>
          <section className="w-full max-w-3xl mb-8 flex flex-wrap justify-center gap-4">
            <Link href="/dogs" className="px-6 py-4 rounded-xl bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 font-bold shadow hover:bg-indigo-200 dark:hover:bg-indigo-800 transition w-48 text-center">
              View All Dogs
            </Link>
            <Link href="/add-dog" className="px-6 py-4 rounded-xl bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 font-bold shadow hover:bg-green-200 dark:hover:bg-green-800 transition w-48 text-center">
              Add Dog
            </Link>
          </section>

          {/* Featured sections - Recent Activity and Weight Tracking */}
          <section className="w-full max-w-3xl mb-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link href="/recent-activity" className="flex flex-col items-center px-8 py-8 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/50 dark:to-indigo-900/50 border-2 border-blue-200 dark:border-blue-700 shadow-lg hover:shadow-xl hover:from-blue-100 hover:to-indigo-100 dark:hover:from-blue-900/70 dark:hover:to-indigo-900/70 transition-all duration-200">
              <span className="text-4xl mb-3">📊</span>
              <span className="font-bold text-blue-700 dark:text-blue-300 mb-2 text-lg">Recent Activity</span>
              <span className="text-gray-600 dark:text-gray-400 text-sm text-center">View your dog's recent activities, health records, and updates</span>
            </Link>
            <Link href="/weight" className="flex flex-col items-center px-8 py-8 rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/50 dark:to-pink-900/50 border-2 border-purple-200 dark:border-purple-700 shadow-lg hover:shadow-xl hover:from-purple-100 hover:to-pink-100 dark:hover:from-purple-900/70 dark:hover:to-pink-900/70 transition-all duration-200">
              <span className="text-4xl mb-3">⚖️</span>
              <span className="font-bold text-purple-700 dark:text-purple-300 mb-2 text-lg">Weight Tracking</span>
              <span className="text-gray-600 dark:text-gray-400 text-sm text-center">Monitor weight trends, log new measurements, and track health</span>
            </Link>
          </section>

          <section className="w-full max-w-3xl grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            <Link href="/needs" className="flex flex-col items-center px-8 py-8 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/50 dark:to-orange-900/50 border-2 border-amber-200 dark:border-amber-700 shadow-lg hover:shadow-xl hover:from-amber-100 hover:to-orange-100 dark:hover:from-amber-900/70 dark:hover:to-orange-900/70 transition-all duration-200">
              <span className="text-4xl mb-3">💩</span>
              <span className="font-bold text-amber-700 dark:text-amber-300 mb-2 text-lg">Report Needs</span>
              <span className="text-gray-600 dark:text-gray-400 text-sm text-center">Track your dog's potty breaks and bathroom schedules</span>
            </Link>
            <Link href="/vaccinations" className="flex flex-col items-center px-8 py-8 rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/50 dark:to-emerald-900/50 border-2 border-green-200 dark:border-green-700 shadow-lg hover:shadow-xl hover:from-green-100 hover:to-emerald-100 dark:hover:from-green-900/70 dark:hover:to-emerald-900/70 transition-all duration-200">
              <span className="text-4xl mb-3">💉</span>
              <span className="font-bold text-green-700 dark:text-green-300 mb-2 text-lg">Report Vaccination</span>
              <span className="text-gray-600 dark:text-gray-400 text-sm text-center">Log vaccinations, medications, and health records</span>
            </Link>
            <Link href="/notifications" className="flex flex-col items-center px-8 py-8 rounded-2xl bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-900/50 dark:to-amber-900/50 border-2 border-yellow-200 dark:border-yellow-700 shadow-lg hover:shadow-xl hover:from-yellow-100 hover:to-amber-100 dark:hover:from-yellow-900/70 dark:hover:to-amber-900/70 transition-all duration-200">
              <span className="text-4xl mb-3">🔔</span>
              <span className="font-bold text-yellow-700 dark:text-yellow-300 mb-2 text-lg">View Notifications</span>
              <span className="text-gray-600 dark:text-gray-400 text-sm text-center">See reminders, alerts, and important updates</span>
            </Link>
            <Link href="/tasks" className="flex flex-col items-center px-8 py-8 rounded-2xl bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-900/50 dark:to-rose-900/50 border-2 border-pink-200 dark:border-pink-700 shadow-lg hover:shadow-xl hover:from-pink-100 hover:to-rose-100 dark:hover:from-pink-900/70 dark:hover:to-rose-900/70 transition-all duration-200">
              <span className="text-4xl mb-3">📝</span>
              <span className="font-bold text-pink-700 dark:text-pink-300 mb-2 text-lg">Task List</span>
              <span className="text-gray-600 dark:text-gray-400 text-sm text-center">Manage your dog's daily tasks and activities</span>
            </Link>
          </section>
        </>
      )}

      {/* Quick Info section is always visible */}
      <section className="w-full max-w-3xl bg-gradient-to-r from-indigo-200 via-white to-blue-200 dark:from-indigo-800 dark:via-gray-700 dark:to-blue-800 rounded-2xl shadow p-8">
        <h2 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mb-4">Quick Info</h2>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-lg text-gray-700 dark:text-gray-300">
          <li>✅ Track vaccinations, medication, and needs</li>
          <li>⏰ Get reminders for walks and treatments</li>
          <li>📄 Document medical records and export for vets</li>
          <li>👨‍👩‍👧‍👦 Share dog info with family or trainers</li>
          <li>🐕 Breed-specific tips and tracking</li>
        </ul>
      </section>
    </main>
  );
}