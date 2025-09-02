"use client";

import Link from "next/link";
import { 
  MdColorLens, 
  MdStraighten, 
  MdNotifications, 
  MdSecurity, 
  MdPerson, 
  MdDevices, 
  MdCalendarMonth, 
  MdSupport, 
  MdInfo,
  MdArrowForward,
  MdHistory
} from "react-icons/md";

const settingsCategories = [
  {
    id: "appearance",
    title: "Appearance",
    description: "Customize your app's look and feel",
    icon: <MdColorLens className="text-2xl" />,
    href: "/settings/theme",
    available: true
  },
  {
    id: "units",
    title: "Units & Measurements",
    description: "Set your preferred units for weight, height, and temperature",
    icon: <MdStraighten className="text-2xl" />,
    href: "/settings/units", 
    available: true
  },
  {
    id: "recent-activity",
    title: "Recent Activity",
    description: "View your dog's recent activities, health records, and tasks",
    icon: <MdHistory className="text-2xl" />,
    href: "/recent-activity",
    available: true
  },
  {
    id: "notifications",
    title: "Notifications",
    description: "Manage push notifications and alerts",
    icon: <MdNotifications className="text-2xl" />,
    href: "/settings/notifications",
    available: false
  },
  {
    id: "privacy",
    title: "Privacy & Security",
    description: "Control your privacy settings and account security",
    icon: <MdSecurity className="text-2xl" />,
    href: "/settings/privacy",
    available: false
  },
  {
    id: "profile",
    title: "Profile Settings",
    description: "Update your personal information and preferences", 
    icon: <MdPerson className="text-2xl" />,
    href: "/settings/profile",
    available: false
  },
  {
    id: "devices",
    title: "Connected Devices",
    description: "Manage wearable devices and integrations",
    icon: <MdDevices className="text-2xl" />,
    href: "/integrations/wearable",
    available: true
  },
  {
    id: "calendar",
    title: "Calendar Integration", 
    description: "Connect your calendar for reminders and scheduling",
    icon: <MdCalendarMonth className="text-2xl" />,
    href: "/integrations/calendar",
    available: true
  },
  {
    id: "support",
    title: "Help & Support",
    description: "Get help, report issues, and contact support",
    icon: <MdSupport className="text-2xl" />,
    href: "/support/faq",
    available: true
  },
  {
    id: "about",
    title: "About Dog Log",
    description: "App version, terms of service, and privacy policy",
    icon: <MdInfo className="text-2xl" />,
    href: "/settings/about",
    available: false
  }
];

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Settings
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Customize your Dog Log experience and manage your preferences
          </p>
        </div>

        {/* Settings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {settingsCategories.map((category) => (
            <div key={category.id} className="relative">
              {category.available ? (
                <Link
                  href={category.href}
                  className="block bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md hover:border-indigo-200 dark:hover:border-indigo-700 transition-all duration-200 group"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="text-indigo-600 dark:text-indigo-400 group-hover:text-indigo-700 dark:group-hover:text-indigo-300 transition-colors">
                          {category.icon}
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-indigo-700 dark:group-hover:text-indigo-300 transition-colors">
                          {category.title}
                        </h3>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                        {category.description}
                      </p>
                    </div>
                    <MdArrowForward className="text-gray-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors ml-2 flex-shrink-0" />
                  </div>
                </Link>
              ) : (
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 opacity-60 cursor-not-allowed">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="text-gray-400">
                          {category.icon}
                        </div>
                        <h3 className="text-lg font-semibold text-gray-500 dark:text-gray-400">
                          {category.title}
                        </h3>
                        <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded-full">
                          Coming Soon
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-500 leading-relaxed">
                        {category.description}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer Info */}
        <div className="mt-12 p-6 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
          <div className="flex items-start gap-3">
            <MdInfo className="text-indigo-600 dark:text-indigo-400 text-xl flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-indigo-900 dark:text-indigo-100 mb-1">
                Need Help?
              </h4>
              <p className="text-sm text-indigo-700 dark:text-indigo-300 mb-3">
                If you can't find what you're looking for, check our help section or contact support.
              </p>
              <div className="flex gap-3">
                <Link 
                  href="/support/faq"
                  className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
                >
                  View FAQ
                </Link>
                <Link 
                  href="/support/contact"
                  className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
                >
                  Contact Support
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
