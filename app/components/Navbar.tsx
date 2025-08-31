"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { checkAuthStatus, clearAuth } from "../lib/auth";
import { useRouter } from "next/navigation";
import { DarkModeToggle } from "./DarkModeToggle";
import { Button } from "../ui/button";

const NAV_SECTIONS = [
  {
    label: "👤 Profile",
    subcategories: [
      { label: "Account", links: [
        { href: "/profile", label: "Profile" },
        { href: "/notifications", label: "Notifications" },
      ]},
      { label: "App Settings", links: [
        { href: "/settings/theme", label: "Theme" },
        { href: "/settings/units", label: "Units" },
      ]},
      { label: "Support", links: [
        { href: "/support/faq", label: "FAQ" },
        { href: "/support/contact", label: "Contact Us" },
      ]},
      { label: "Integrations", links: [
        { href: "/integrations/wearable", label: "Wearable Device" },
        { href: "/integrations/calendar", label: "Calendar" },
      ]},
    ],
  },
  {
    label: "🏠 Home",
    subcategories: [
      { label: null, links: [
        { href: "/dogs", label: "All Dogs" },
        { href: "/add-dog", label: "Add Dog" },
        { href: "/needs", label: "Report Needs" },
        { href: "/vaccinations", label: "Vaccinations" },
        { href: "/tasks", label: "Tasks" },
      ]},
    ],
  },
  {
    label: "💬 Forum",
    subcategories: [
      { label: null, links: [
        { href: "/forum", label: "Forum" },
      ]},
    ],
  },
];


export default function Navbar() {
  const router = useRouter();
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [mobileTab, setMobileTab] = useState("Home");
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const pathname = typeof window !== 'undefined' ? window.location.pathname : "";
  // Store refs for each dropdown
  const dropdownRefs = useRef<Record<string, HTMLDivElement | null>>({});
  // Expose checkAuth for use in handlers
  const checkAuth = async () => {
    const result = await checkAuthStatus();
    setIsSignedIn(result.isAuthenticated);
    setAuthChecked(true);
  };

  // Click outside to close dropdown
  useEffect(() => {
    if (!expandedSection) return;
    function handleClick(e: MouseEvent) {
      if (!expandedSection) return;
  const ref = dropdownRefs.current[expandedSection!];
      if (ref && !ref.contains(e.target as Node)) {
        setExpandedSection(null);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expandedSection]);

  // Set isMobile after mount and on resize
  useEffect(() => {
    setMounted(true);
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Click outside to close dropdown
  useEffect(() => {
    if (!expandedSection) return;
    function handleClick(e: MouseEvent) {
      if (!expandedSection) return;
      const ref = dropdownRefs.current[expandedSection];
      if (ref && !ref.contains(e.target as Node)) {
        setExpandedSection(null);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [expandedSection]);

  // Check auth status on mount and listen for auth changes (custom event and storage)
  useEffect(() => {
    let ignore = false;
    // Wrap checkAuth to respect ignore flag
    const wrappedCheckAuth = async () => {
      const result = await checkAuthStatus();
      if (!ignore) {
        setIsSignedIn(result.isAuthenticated);
        setAuthChecked(true);
      }
    };
    wrappedCheckAuth();
    // Listen for auth changes via custom event and storage event
    function handleAuthChange() {
      wrappedCheckAuth();
    }
    function handleStorage(e: StorageEvent) {
      if (e.key === 'auth-state-changed') {
        wrappedCheckAuth();
      }
    }
    window.addEventListener('authStateChanged', handleAuthChange);
    window.addEventListener('storage', handleStorage);
    return () => {
      ignore = true;
      window.removeEventListener('authStateChanged', handleAuthChange);
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  if (!mounted || !authChecked) return null;

  // Desktop Navbar
  const desktopNav = (
    <nav className="w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur sticky top-0 z-50 shadow-md border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2">
            <img src="/doglog-logo.png" alt="Dog Log Logo" className="h-10 w-10 rounded-full shadow" />
            <span className="text-xl lg:text-2xl font-extrabold text-indigo-700 dark:text-indigo-400 tracking-tight">Dog Log</span>
          </Link>
          <DarkModeToggle />
        </div>
        <div className="flex gap-4">
          {isSignedIn && NAV_SECTIONS.map(section => (
            <div key={section.label} className="relative">
              <Button
                type="button"
                className={`bg-transparent text-indigo-700 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 font-bold px-5 py-3 rounded-xl border-none shadow-none text-base ${expandedSection === section.label ? 'underline' : ''}`}
                onClick={() => setExpandedSection(expandedSection === section.label ? null : section.label)}
              >
                {section.label}
              </Button>
              {expandedSection === section.label && (
                <div
                  ref={el => { dropdownRefs.current[section.label] = el; }}
                  className="absolute left-0 mt-2 w-72 bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50"
                >
                  <div className="py-2">
                    {section.subcategories.map(subcat => (
                      <div key={subcat.label || 'main'} className="mb-2">
                        {subcat.label && (
                          <div className="px-4 py-1 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{subcat.label}</div>
                        )}
                        <ul className="space-y-1">
                          {subcat.links.map(item => (
                            <li key={item.href}>
                              <Link
                                href={item.href}
                                className={`block px-6 py-2 rounded-lg font-semibold transition text-sm ${pathname === item.href ? 'bg-indigo-600 text-white shadow' : 'text-indigo-700 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/50'}`}
                                onClick={() => setExpandedSection(null)}
                              >
                                {item.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="flex gap-2 items-center ml-4">
          {!isSignedIn ? (
            <>
              <Link href="/signin" className="px-4 py-2 rounded-lg font-semibold text-indigo-700 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition" onClick={async () => { localStorage.setItem('authStatus', Date.now().toString()); await checkAuth(); }}>Sign In</Link>
              <Link href="/signup" className="px-4 py-2 rounded-lg font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition" onClick={async () => { localStorage.setItem('authStatus', Date.now().toString()); await checkAuth(); }}>Sign Up</Link>
            </>
          ) : (
            <button onClick={async () => { await clearAuth(); localStorage.setItem('authStatus', Date.now().toString()); await checkAuth(); router.push('/'); }} className="px-4 py-2 rounded-lg font-semibold text-white bg-red-600 hover:bg-red-700 transition">Sign Out</button>
          )}
        </div>
      </div>
    </nav>
  );

  // Mobile Navbar (simplified, fullscreen drawer)
  const mobileNav = (
    <>
      <nav className="w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur sticky top-0 z-50 shadow-md border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2">
          <img src="/doglog-logo.png" alt="Dog Log Logo" className="h-10 w-10 rounded-full shadow" />
          <span className="text-xl font-extrabold text-indigo-700 dark:text-indigo-400 tracking-tight">Dog Log</span>
        </Link>
        <div className="flex items-center gap-2">
          <DarkModeToggle />
          <button
            onClick={() => setIsMobileDrawerOpen(!isMobileDrawerOpen)}
            className="p-2 rounded-lg text-indigo-700 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/50"
            aria-label={isMobileDrawerOpen ? 'Close navigation menu' : 'Open navigation menu'}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMobileDrawerOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </nav>
      {isMobileDrawerOpen && (
        <div className="fixed inset-0 z-50 bg-white dark:bg-gray-900 flex flex-col">
          <div className="flex items-center px-4 py-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-md">
            <button onClick={() => setIsMobileDrawerOpen(false)} className="mr-2 text-2xl" aria-label="Close navigation menu">
              <span role="img" aria-label="Back">🔙</span>
            </button>
            <h2 className="flex-1 text-center text-lg font-bold text-indigo-700 dark:text-indigo-300">
              {mobileTab === 'Profile' && '👤 Profile'}
              {mobileTab === 'Home' && '🏠 Home'}
              {mobileTab === 'Forum' && '💬 Forum'}
            </h2>
            <span className="w-8" />
          </div>
          <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 flex gap-2 items-center justify-end">
            {!isSignedIn ? (
              <>
                <Link href="/signin" className="px-4 py-2 rounded-lg font-semibold text-indigo-700 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition" onClick={async () => { localStorage.setItem('authStatus', Date.now().toString()); await checkAuth(); }}>Sign In</Link>
                <Link href="/signup" className="px-4 py-2 rounded-lg font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition" onClick={async () => { localStorage.setItem('authStatus', Date.now().toString()); await checkAuth(); }}>Sign Up</Link>
              </>
            ) : null}
          </div>
          {/* Tab content for mobile (simplified) */}
          <div className="flex-1 overflow-y-auto p-4 pb-20">
            {isSignedIn ? (
              <>
                {mobileTab === "Home" && (
                  <ul className="space-y-1">
                    <li><Link href="/dogs" className="block px-6 py-2 rounded-lg font-semibold transition text-sm" onClick={() => setIsMobileDrawerOpen(false)}>All Dogs</Link></li>
                    <li><Link href="/add-dog" className="block px-6 py-2 rounded-lg font-semibold transition text-sm" onClick={() => setIsMobileDrawerOpen(false)}>Add Dog</Link></li>
                    <li><Link href="/needs" className="block px-6 py-2 rounded-lg font-semibold transition text-sm" onClick={() => setIsMobileDrawerOpen(false)}>Report Needs</Link></li>
                    <li><Link href="/vaccinations" className="block px-6 py-2 rounded-lg font-semibold transition text-sm" onClick={() => setIsMobileDrawerOpen(false)}>Vaccinations</Link></li>
                    <li><Link href="/tasks" className="block px-6 py-2 rounded-lg font-semibold transition text-sm" onClick={() => setIsMobileDrawerOpen(false)}>Tasks</Link></li>
                  </ul>
                )}
                {mobileTab === "Forum" && (
                  <ul className="space-y-1">
                    <li><Link href="/forum" className="block px-6 py-2 rounded-lg font-semibold transition text-sm" onClick={() => setIsMobileDrawerOpen(false)}>Forum</Link></li>
                  </ul>
                )}
                {mobileTab === "Profile" && (
                  <div className="space-y-4">
                    {/* Account */}
                    <div>
                      <div className="px-2 py-1 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Account</div>
                      <ul className="space-y-1">
                        <li><Link href="/profile" className="block px-6 py-2 rounded-lg font-semibold transition text-sm" onClick={() => setIsMobileDrawerOpen(false)}>Profile</Link></li>
                        <li><Link href="/notifications" className="block px-6 py-2 rounded-lg font-semibold transition text-sm" onClick={() => setIsMobileDrawerOpen(false)}>Notifications</Link></li>
                      </ul>
                    </div>
                    {/* App Settings */}
                    <div>
                      <div className="px-2 py-1 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">App Settings</div>
                      <ul className="space-y-1">
                        <li><Link href="/settings/theme" className="block px-6 py-2 rounded-lg font-semibold transition text-sm" onClick={() => setIsMobileDrawerOpen(false)}>Theme</Link></li>
                        <li><Link href="/settings/units" className="block px-6 py-2 rounded-lg font-semibold transition text-sm" onClick={() => setIsMobileDrawerOpen(false)}>Units</Link></li>
                      </ul>
                    </div>
                    {/* Support */}
                    <div>
                      <div className="px-2 py-1 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Support</div>
                      <ul className="space-y-1">
                        <li><Link href="/support/faq" className="block px-6 py-2 rounded-lg font-semibold transition text-sm" onClick={() => setIsMobileDrawerOpen(false)}>FAQ</Link></li>
                        <li><Link href="/support/contact" className="block px-6 py-2 rounded-lg font-semibold transition text-sm" onClick={() => setIsMobileDrawerOpen(false)}>Contact Us</Link></li>
                      </ul>
                    </div>
                    {/* Integrations */}
                    <div>
                      <div className="px-2 py-1 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Integrations</div>
                      <ul className="space-y-1">
                        <li><Link href="/integrations/wearable" className="block px-6 py-2 rounded-lg font-semibold transition text-sm" onClick={() => setIsMobileDrawerOpen(false)}>Wearable Device</Link></li>
                        <li><Link href="/integrations/calendar" className="block px-6 py-2 rounded-lg font-semibold transition text-sm" onClick={() => setIsMobileDrawerOpen(false)}>Calendar</Link></li>
                      </ul>
                    </div>
                    {/* Log Out button at the bottom of Profile tab */}
                    <div className="pt-4">
                      <button onClick={async () => { await clearAuth(); localStorage.setItem('authStatus', Date.now().toString()); await checkAuth(); setIsMobileDrawerOpen(false); router.push('/'); }} className="w-full px-4 py-2 rounded-lg font-semibold text-white bg-red-600 hover:bg-red-700 transition">Log Out</button>
                    </div>
                  </div>
                )}
              </>
            ) : null}
          </div>
          {/* Bottom nav as tab switcher */}
          {isSignedIn && (
            <div className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 flex justify-around items-center h-16 shadow-lg">
              <button className={`flex flex-col items-center justify-center px-2 py-1 text-xs font-semibold transition ${mobileTab === 'Home' ? 'text-indigo-600' : 'text-gray-500 dark:text-gray-300 hover:text-indigo-700 dark:hover:text-indigo-400'}`} onClick={() => setMobileTab('Home')}>
                <span className="text-xl">🏠</span>
                <span>Home</span>
              </button>
              <button className={`flex flex-col items-center justify-center px-2 py-1 text-xs font-semibold transition ${mobileTab === 'Forum' ? 'text-indigo-600' : 'text-gray-500 dark:text-gray-300 hover:text-indigo-700 dark:hover:text-indigo-400'}`} onClick={() => setMobileTab('Forum')}>
                <span className="text-xl">💬</span>
                <span>Forum</span>
              </button>
              <button className={`flex flex-col items-center justify-center px-2 py-1 text-xs font-semibold transition ${mobileTab === 'Profile' ? 'text-indigo-600' : 'text-gray-500 dark:text-gray-300 hover:text-indigo-700 dark:hover:text-indigo-400'}`} onClick={() => setMobileTab('Profile')}>
                <span className="text-xl">👤</span>
                <span>Profile</span>
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );

  // Render
  return isMobile ? mobileNav : desktopNav;
}