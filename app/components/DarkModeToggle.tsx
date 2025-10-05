'use client';
import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { MdLightMode, MdDarkMode } from 'react-icons/md';

export function DarkModeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
      aria-label="Toggle dark mode"
    >
      {theme === 'dark' ? (
        <MdLightMode className="text-xl text-yellow-400" />
      ) : (
        <MdDarkMode className="text-xl text-indigo-600" />
      )}
    </button>
  );
}