"use client";


import Link from "next/link";
import { MdAccountCircle } from "react-icons/md";

export default function ProfileMenuPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 via-white to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-900 p-8">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-8 border border-gray-200 dark:border-gray-700">
        <h1 className="text-3xl font-bold text-indigo-700 dark:text-indigo-400 mb-8 flex items-center justify-center gap-3">
          <MdAccountCircle className="inline text-4xl align-middle" />
          Profile
        </h1>
        <nav className="space-y-8">
          <div>
            <div className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-2">Account</div>
            <ul className="space-y-2 pl-4">
              <li><Link href="/profile" className="text-lg text-indigo-700 dark:text-indigo-300 hover:underline">Profile</Link></li>
              <li><Link href="/notifications" className="text-lg text-indigo-700 dark:text-indigo-300 hover:underline">Notifications</Link></li>
            </ul>
          </div>
          <div>
            <div className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-2">App Settings</div>
            <ul className="space-y-2 pl-4">
              <li><Link href="/settings/theme" className="text-lg text-indigo-700 dark:text-indigo-300 hover:underline">Theme</Link></li>
              <li><Link href="/settings/units" className="text-lg text-indigo-700 dark:text-indigo-300 hover:underline">Units</Link></li>
            </ul>
          </div>
          <div>
            <div className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-2">Support</div>
            <ul className="space-y-2 pl-4">
              <li><Link href="/support/faq" className="text-lg text-indigo-700 dark:text-indigo-300 hover:underline">FAQ</Link></li>
              <li><Link href="/support/contact" className="text-lg text-indigo-700 dark:text-indigo-300 hover:underline">Contact Us</Link></li>
            </ul>
          </div>
          <div>
            <div className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-2">Integrations</div>
            <ul className="space-y-2 pl-4">
              <li><Link href="/integrations/wearable" className="text-lg text-indigo-700 dark:text-indigo-300 hover:underline">Wearable Device</Link></li>
              <li><Link href="/integrations/calendar" className="text-lg text-indigo-700 dark:text-indigo-300 hover:underline">Calendar</Link></li>
            </ul>
          </div>
        </nav>
      </div>
    </main>
  );
}
