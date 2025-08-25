'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { checkAuthStatus, clearAuth } from '@/app/lib/auth';

export default function Page() {
  const [userName, setUserName] = useState('visitor');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const verifyUser = async () => {
      const { isAuthenticated: authStatus, user } = await checkAuthStatus();
      setIsAuthenticated(authStatus);
      
      if (authStatus && user) {
        setUserName(user.name || user.email?.split('@')[0] || 'user');
      } else {
        setUserName('visitor');
      }
    };

    verifyUser();
  }, []);

  function handleLogout() {
    clearAuth();
    setUserName('visitor');
    setIsAuthenticated(false);
    window.location.reload();
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
          {isAuthenticated && (
            <button
              onClick={handleLogout}
              className="px-6 py-2 rounded-full bg-red-500 text-white font-semibold shadow hover:bg-red-600 transition"
            >
              Log Out
            </button>
          )}
          <Link href="/forum" className="px-6 py-2 rounded-full bg-yellow-400 text-white font-semibold shadow hover:bg-yellow-500 transition">Forum</Link>
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

          <section className="w-full max-w-3xl grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            <Link href="/needs" className="flex flex-col items-center px-6 py-6 rounded-2xl bg-indigo-50 dark:bg-indigo-900/50 shadow hover:bg-indigo-100 dark:hover:bg-indigo-900/70 transition">
              <span className="text-3xl mb-2">💩</span>
              <span className="font-bold text-indigo-700 dark:text-indigo-300 mb-1">Report Needs</span>
              <span className="text-gray-600 dark:text-gray-400 text-sm">Track your dog's potty breaks</span>
            </Link>
            <Link href="/vaccinations" className="flex flex-col items-center px-6 py-6 rounded-2xl bg-green-50 dark:bg-green-900/50 shadow hover:bg-green-100 dark:hover:bg-green-900/70 transition">
              <span className="text-3xl mb-2">💉</span>
              <span className="font-bold text-green-700 dark:text-green-300 mb-1">Report Vaccination</span>
              <span className="text-gray-600 dark:text-gray-400 text-sm">Log vaccinations and medication</span>
            </Link>
            <Link href="/notifications" className="flex flex-col items-center px-6 py-6 rounded-2xl bg-yellow-50 dark:bg-yellow-900/50 shadow hover:bg-yellow-100 dark:hover:bg-yellow-900/70 transition">
              <span className="text-3xl mb-2">🔔</span>
              <span className="font-bold text-yellow-700 dark:text-yellow-300 mb-1">View Notifications</span>
              <span className="text-gray-600 dark:text-gray-400 text-sm">See reminders and alerts</span>
            </Link>
            <Link href="/tasks" className="flex flex-col items-center px-6 py-6 rounded-2xl bg-pink-50 dark:bg-pink-900/50 shadow hover:bg-pink-100 dark:hover:bg-pink-900/70 transition">
              <span className="text-3xl mb-2">📝</span>
              <span className="font-bold text-pink-700 dark:text-pink-300 mb-1">Task List</span>
              <span className="text-gray-600 dark:text-gray-400 text-sm">Manage your dog's tasks</span>
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