import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-6 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-2">
            <img src="/doglog-logo.png" alt="Dog Log Logo" className="h-8 w-8 rounded-full shadow" />
            <span className="text-lg font-semibold text-gray-800 dark:text-gray-200">
              Dog Log
            </span>
          </div>
          
          {/* Legal Links */}
          <div className="flex space-x-6 text-sm">
            <Link 
              href="/terms" 
              className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              Terms of Service
            </Link>
            <Link 
              href="/privacy" 
              className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              Privacy Policy
            </Link>
          </div>
          
          {/* Copyright */}
          <div className="text-sm text-gray-500 dark:text-gray-400">
            © 2024 Dog Log. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
