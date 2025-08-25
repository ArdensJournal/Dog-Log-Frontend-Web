'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { DarkModeToggle } from './DarkModeToggle';
import { checkAuthStatus, hasValidToken } from '@/app/lib/auth';

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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Improved authentication check
  const verifyAuthentication = async () => {
    const { isAuthenticated } = await checkAuthStatus();
    setIsSignedIn(isAuthenticated);
  };

  useEffect(() => {
    // Initial check
    verifyAuthentication();

    // Listen for storage changes (when user signs in/out in another tab)
    const handleStorage = () => verifyAuthentication();
    window.addEventListener('storage', handleStorage);

    // Check authentication status periodically, but less frequently
    const interval = setInterval(() => {
      verifyAuthentication();
    }, 10000); // Check every 10 seconds instead of 500ms

    // Check screen size
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 640);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('resize', checkScreenSize);
      clearInterval(interval);
    };
  }, []);

  const allLinks = [...publicLinks, ...(isSignedIn ? privateLinks : [])];

  return (
    <nav className="w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur sticky top-0 z-50 shadow-md border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-5xl mx-auto px-4 py-3">
        {/* First Row: Logo and Controls */}
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <img src="/doglog-logo.png" alt="Dog Log Logo" className="h-10 w-10 rounded-full shadow" />
            <span className="text-xl lg:text-2xl font-extrabold text-indigo-700 dark:text-indigo-400 tracking-tight">Dog Log</span>
          </Link>
          
          {/* Right side: Dark mode + Hamburger (mobile only) */}
          <div className="flex items-center gap-2">
            <DarkModeToggle />
            {isMobile && (
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-lg text-indigo-700 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/50"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {isMobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            )}
          </div>
        </div>
        
        {/* Second Row: Desktop Navigation */}
        {!isMobile && (
          <div className="mt-3">
            <ul className="flex flex-wrap gap-1 md:gap-2 lg:gap-4 items-center justify-center">
              {allLinks.map(link => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`px-1 py-1 md:px-2 md:py-1 lg:px-3 lg:py-2 rounded-lg font-semibold transition text-xs md:text-sm lg:text-base ${
                      pathname === link.href
                        ? 'bg-indigo-600 text-white shadow'
                        : 'text-indigo-700 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/50'
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Mobile Dropdown Menu */}
      {isMobile && isMobileMenuOpen && (
        <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur border-t border-gray-200 dark:border-gray-700">
          <ul className="px-4 py-2 space-y-1">
            {allLinks.map(link => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block px-3 py-2 rounded-lg font-semibold transition ${
                    pathname === link.href
                      ? 'bg-indigo-600 text-white shadow'
                      : 'text-indigo-700 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/50'
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
}