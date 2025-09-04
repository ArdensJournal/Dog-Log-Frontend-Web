"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { checkAuthStatus, clearAuth } from "../lib/auth";
import { useRouter, usePathname } from "next/navigation";
import { DarkModeToggle } from "./DarkModeToggle";
import { Button } from "../ui/button";
import { MdArrowBackIos, MdAccountCircle, MdHomeFilled, MdGroups, MdNotifications, MdBusiness } from "react-icons/md";

const NAV_SECTIONS = [
  {
    id: "profile",
    label: <span className="inline-flex items-center gap-1"><MdAccountCircle className="inline text-lg align-middle" /> Profile</span>,
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
    id: "home",
    label: <span className="inline-flex items-center gap-1"><MdHomeFilled className="inline text-lg align-middle" /> Home</span>,
    subcategories: [
      { label: null, links: [
        { href: "/dogs", label: "All Dogs" },
        { href: "/add-dog", label: "Add Dog" },
        { href: "/needs", label: "Report Needs" },
        { href: "/weight", label: "Weight Tracking" },
        { href: "/vaccinations", label: "Vaccinations" },
        { href: "/tasks", label: "Tasks" },
      ]},
    ],
  },
  {
    id: "community",
    label: <span className="inline-flex items-center gap-1"><MdGroups className="inline text-lg align-middle" /> Community</span>,
    subcategories: [
      { label: null, links: [
        { href: "/forum", label: "Community" },
      ]},
    ],
  },
  {
    id: "notifications",
    label: <span className="inline-flex items-center gap-1"><MdNotifications className="inline text-lg align-middle" /> Notifications</span>,
    subcategories: [
      { label: null, links: [
        { href: "/notifications", label: "Notifications" },
      ]},
    ],
  },
  {
    id: "services",
    label: <span className="inline-flex items-center gap-1"><MdBusiness className="inline text-lg align-middle" /> Services</span>,
    subcategories: [
      { label: null, links: [
        { href: "/services", label: "Services" },
      ]},
    ],
  },
];


export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname(); // Use Next.js pathname hook instead of window.location
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [mobileTab, setMobileTab] = useState("Home");
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [isBottomNavVisible, setIsBottomNavVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
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

  // Handle bottom navigation scroll behavior on mobile
  useEffect(() => {
    if (!mounted || !isMobile) return;
    
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down - hide bottom nav
        setIsBottomNavVisible(false);
      } else if (currentScrollY < lastScrollY) {
        // Scrolling up - show bottom nav
        setIsBottomNavVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY, mounted, isMobile]);

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
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-3">
            <img src="/doglog-logo.png" alt="Dog Log Logo" className="h-10 w-10 rounded-full shadow" />
            <span className="text-xl lg:text-2xl font-extrabold text-indigo-700 dark:text-indigo-400 tracking-tight">Dog Log</span>
          </Link>
          <DarkModeToggle />
        </div>
        <div className="flex gap-2">
          {isSignedIn && (
            <>
              <Link
                href="/"
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium text-indigo-700 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors"
              >
                <MdHomeFilled className="text-lg" />
                Home
              </Link>
              <Link
                href="/forum"
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium text-indigo-700 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors"
              >
                <MdGroups className="text-lg" />
                Community
              </Link>
              <Link
                href="/notifications"
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium text-indigo-700 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors"
              >
                <MdNotifications className="text-lg" />
                Notifications
              </Link>
              <Link
                href="/services"
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium text-indigo-700 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors"
              >
                <MdBusiness className="text-lg" />
                Services
              </Link>
              <Link
                href="/profile"
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium text-indigo-700 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors"
              >
                <MdAccountCircle className="text-lg" />
                Profile
              </Link>
            </>
          )}
        </div>
        <div className="flex gap-3 items-center">
          {!isSignedIn ? (
            <>
              <Link href="/signin" className="px-4 py-2 rounded-lg font-medium text-indigo-700 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors" onClick={async () => { localStorage.setItem('authStatus', Date.now().toString()); await checkAuth(); }}>Sign In</Link>
              <Link href="/signup" className="px-4 py-2 rounded-lg font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition-colors" onClick={async () => { localStorage.setItem('authStatus', Date.now().toString()); await checkAuth(); }}>Sign Up</Link>
            </>
          ) : (
            <button onClick={async () => { await clearAuth(); localStorage.setItem('authStatus', Date.now().toString()); await checkAuth(); router.push('/'); }} className="px-3 py-2 rounded-lg font-medium text-sm text-white bg-red-600 hover:bg-red-700 transition-colors">Sign Out</button>
          )}
        </div>
      </div>
    </nav>
  );

  // Mobile Navbar (Facebook-style with bottom navigation)
  const mobileNav = (
    <>
      {/* Top header - simplified */}
      <nav className="w-full bg-white/95 dark:bg-gray-900/95 backdrop-blur sticky top-0 z-40 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between px-4 py-3">
          <Link href="/" className="flex items-center gap-2">
            <img src="/doglog-logo.png" alt="Dog Log Logo" className="h-8 w-8 rounded-full shadow" />
            <span className="text-lg font-bold text-indigo-700 dark:text-indigo-400 tracking-tight">Dog Log</span>
          </Link>
          <div className="flex items-center gap-2">
            <DarkModeToggle />
            {isSignedIn && (
              <button 
                onClick={async () => { 
                  await clearAuth(); 
                  localStorage.setItem('authStatus', Date.now().toString()); 
                  await checkAuth(); 
                  router.push('/'); 
                }} 
                className="px-3 py-2 rounded-lg font-semibold text-white bg-red-600 hover:bg-red-700 transition-colors text-sm"
              >
                Sign Out
              </button>
            )}
            <Link
              href="/settings"
              className="p-2 rounded-lg text-indigo-700 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors"
              aria-label="Settings"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </Link>
          </div>
        </div>
      </nav>

      {/* Facebook-style Bottom Navigation */}
      {isSignedIn && (
        <div className={`fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur border-t border-gray-200 dark:border-gray-700 transition-transform duration-300 ${
          isBottomNavVisible ? 'translate-y-0' : 'translate-y-full'
        }`}>
          <div className="flex justify-around items-center py-2">
            <Link href="/" className="flex flex-col items-center py-2 px-3 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-800">
              <MdHomeFilled className={`text-2xl mb-1 ${pathname === '/' ? 'text-indigo-600' : 'text-gray-600 dark:text-gray-400'}`} />
              <span className={`text-xs font-medium ${pathname === '/' ? 'text-indigo-600' : 'text-gray-600 dark:text-gray-400'}`}>Home</span>
            </Link>
            <Link href="/forum" className="flex flex-col items-center py-2 px-3 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-800">
              <MdGroups className={`text-2xl mb-1 ${pathname === '/forum' ? 'text-indigo-600' : 'text-gray-600 dark:text-gray-400'}`} />
              <span className={`text-xs font-medium ${pathname === '/forum' ? 'text-indigo-600' : 'text-gray-600 dark:text-gray-400'}`}>Community</span>
            </Link>
            <Link href="/notifications" className="flex flex-col items-center py-2 px-3 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-800">
              <MdNotifications className={`text-2xl mb-1 ${pathname === '/notifications' ? 'text-indigo-600' : 'text-gray-600 dark:text-gray-400'}`} />
              <span className={`text-xs font-medium ${pathname === '/notifications' ? 'text-indigo-600' : 'text-gray-600 dark:text-gray-400'}`}>Notifications</span>
            </Link>
            <Link href="/services" className="flex flex-col items-center py-2 px-3 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-800">
              <MdBusiness className={`text-2xl mb-1 ${pathname === '/services' ? 'text-indigo-600' : 'text-gray-600 dark:text-gray-400'}`} />
              <span className={`text-xs font-medium ${pathname === '/services' ? 'text-indigo-600' : 'text-gray-600 dark:text-gray-400'}`}>Services</span>
            </Link>
            <Link href="/profile" className="flex flex-col items-center py-2 px-3 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-800">
              <MdAccountCircle className={`text-2xl mb-1 ${pathname === '/profile' ? 'text-indigo-600' : 'text-gray-600 dark:text-gray-400'}`} />
              <span className={`text-xs font-medium ${pathname === '/profile' ? 'text-indigo-600' : 'text-gray-600 dark:text-gray-400'}`}>Profile</span>
            </Link>
          </div>
        </div>
      )}
    </>
  );

  // Render
  return isMobile ? mobileNav : desktopNav;
}