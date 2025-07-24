'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

const publicLinks = [
  { href: '/', label: 'Home' },
  { href: '/forum', label: 'Forum' },
];

const privateLinks = [
  { href: '/dogs', label: 'All Dogs' },
  { href: '/add-dog', label: 'Add Dog' },
  { href: '/needs', label: 'Report Needs' },
  { href: '/vaccinations', label: 'Vaccinations' },
  { href: '/notifications', label: 'Notifications' },
  { href: '/tasks', label: 'Tasks' },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isSignedIn, setIsSignedIn] = useState(false);

  // Helper to check token
  const checkSignedIn = () => !!localStorage.getItem('accessToken');

  useEffect(() => {
    setIsSignedIn(checkSignedIn());

    // Listen for storage changes (login/logout in other tabs)
    const handleStorage = () => setIsSignedIn(checkSignedIn());
    window.addEventListener('storage', handleStorage);

    // Listen for login/logout in this tab (if you update localStorage directly)
    const interval = setInterval(() => {
      setIsSignedIn(checkSignedIn());
    }, 500);

    return () => {
      window.removeEventListener('storage', handleStorage);
      clearInterval(interval);
    };
  }, []);

  return (
    <nav className="w-full bg-white/80 backdrop-blur sticky top-0 z-50 shadow-md">
      <div className="max-w-5xl mx-auto flex items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2">
          <img src="/doglog-logo.png" alt="Dog Log Logo" className="h-10 w-10 rounded-full shadow" />
          <span className="text-2xl font-extrabold text-indigo-700 tracking-tight">Dog Log</span>
        </Link>
        <ul className="flex flex-wrap gap-2 md:gap-4 items-center">
          {publicLinks.map(link => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`px-3 py-2 rounded-lg font-semibold transition ${
                  pathname === link.href
                    ? 'bg-indigo-600 text-white shadow'
                    : 'text-indigo-700 hover:bg-indigo-100'
                }`}
              >
                {link.label}
              </Link>
            </li>
          ))}
          {isSignedIn &&
            privateLinks.map(link => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`px-3 py-2 rounded-lg font-semibold transition ${
                    pathname === link.href
                      ? 'bg-indigo-600 text-white shadow'
                      : 'text-indigo-700 hover:bg-indigo-100'
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
        </ul>
      </div>
    </nav>
  );
}