"use client";

import Link from "next/link";
import { 
  MdAccountCircle, 
  MdHistory, 
  MdNotifications,
  MdColorLens,
  MdStraighten,
  MdSupport,
  MdContactMail,
  MdScale,
  MdDevices,
  MdCalendarMonth,
  MdArrowForward,
  MdPerson,
  MdSettings
} from "react-icons/md";

const profileSections = [
  {
    title: "Account",
    items: [
      {
        id: "profile-info",
        title: "Profile Information",
        description: "View and edit your personal information",
        icon: <MdPerson className="text-xl" />,
        href: "/profile/edit",
        available: true
      },
      {
        id: "recent-activity",
        title: "Recent Activity",
        description: "View your dog's recent activities and health records",
        icon: <MdHistory className="text-xl" />,
        href: "/recent-activity",
        available: true
      },
      {
        id: "weight-tracking",
        title: "Weight Tracking",
        description: "Monitor your dog's weight trends and health",
        icon: <MdScale className="text-xl" />,
        href: "/weight",
        available: true
      },
      {
        id: "notifications",
        title: "Notifications",
        description: "Manage your notification preferences",
        icon: <MdNotifications className="text-xl" />,
        href: "/notifications",
        available: true
      }
    ]
  },
  {
    title: "App Settings",
    items: [
      {
        id: "theme",
        title: "Theme & Appearance",
        description: "Customize colors and display settings",
        icon: <MdColorLens className="text-xl" />,
        href: "/settings/theme",
        available: true
      },
      {
        id: "units",
        title: "Units & Measurements",
        description: "Set preferred units for weight and measurements",
        icon: <MdStraighten className="text-xl" />,
        href: "/settings/units",
        available: true
      }
    ]
  },
  {
    title: "Settings",
    items: [
      {
        id: "all-settings",
        title: "All Settings",
        description: "Access all app settings and preferences",
        icon: <MdSettings className="text-xl" />,
        href: "/settings",
        available: true
      }
    ]
  },
  {
    title: "Integrations",
    items: [
      {
        id: "wearable",
        title: "Wearable Devices",
        description: "Connect fitness trackers and smart collars",
        icon: <MdDevices className="text-xl" />,
        href: "/integrations/wearable",
        available: true
      },
      {
        id: "calendar",
        title: "Calendar Sync",
        description: "Sync with your calendar for reminders",
        icon: <MdCalendarMonth className="text-xl" />,
        href: "/integrations/calendar",
        available: true
      }
    ]
  },
  {
    title: "Support",
    items: [
      {
        id: "faq",
        title: "FAQ & Help",
        description: "Find answers to common questions",
        icon: <MdSupport className="text-xl" />,
        href: "/support/faq",
        available: true
      },
      {
        id: "contact",
        title: "Contact Support",
        description: "Get help from our support team",
        icon: <MdContactMail className="text-xl" />,
        href: "/support/contact",
        available: true
      }
    ]
  }
];

export default function ProfileMenuPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-4 py-6 sm:px-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-100 dark:bg-indigo-900/50 rounded-full">
              <MdAccountCircle className="text-3xl text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                Profile
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Manage your account and app preferences
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6">
        {/* Quick Actions - Mobile Only */}
        <div className="sm:hidden mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Quick Actions
            </h2>
            <div className="grid grid-cols-2 gap-3">
              <Link
                href="/recent-activity"
                className="flex items-center gap-3 p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 transition-colors"
              >
                <MdHistory className="text-indigo-600 dark:text-indigo-400 text-xl" />
                <div>
                  <div className="font-medium text-indigo-900 dark:text-indigo-100 text-sm">
                    Activity
                  </div>
                </div>
              </Link>
              <Link
                href="/settings"
                className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
              >
                <MdSettings className="text-gray-600 dark:text-gray-400 text-xl" />
                <div>
                  <div className="font-medium text-gray-900 dark:text-white text-sm">
                    Settings
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* Profile Sections */}
        <div className="space-y-8">
          {profileSections.map((section, sectionIndex) => (
            <div key={section.title}>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                {section.title}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {section.items.map((item) => (
                  <Link
                    key={item.id}
                    href={item.href}
                    className={`block bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 transition-all duration-200 ${
                      item.available
                        ? 'hover:shadow-md hover:border-indigo-200 dark:hover:border-indigo-700 group'
                        : 'opacity-60 cursor-not-allowed'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className={`${
                            item.available
                              ? 'text-indigo-600 dark:text-indigo-400 group-hover:text-indigo-700 dark:group-hover:text-indigo-300'
                              : 'text-gray-400 dark:text-gray-500'
                          } transition-colors`}>
                            {item.icon}
                          </div>
                          <h3 className={`font-semibold ${
                            item.available
                              ? 'text-gray-900 dark:text-white group-hover:text-indigo-700 dark:group-hover:text-indigo-300'
                              : 'text-gray-500 dark:text-gray-400'
                          } transition-colors`}>
                            {item.title}
                          </h3>
                        </div>
                        <p className={`text-sm leading-relaxed ${
                          item.available
                            ? 'text-gray-600 dark:text-gray-400'
                            : 'text-gray-500 dark:text-gray-500'
                        }`}>
                          {item.description}
                        </p>
                      </div>
                      {item.available && (
                        <MdArrowForward className="text-gray-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors ml-3 flex-shrink-0" />
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* All Settings Link - Desktop */}
        <div className="hidden sm:block mt-12">
          <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-xl p-6 border border-indigo-200 dark:border-indigo-800">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-indigo-900 dark:text-indigo-100 mb-1">
                  Need More Options?
                </h3>
                <p className="text-indigo-700 dark:text-indigo-300">
                  Visit the settings page for advanced configuration and additional features.
                </p>
              </div>
              <Link
                href="/settings"
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors"
              >
                <MdSettings className="text-xl" />
                <span className="hidden lg:inline">All Settings</span>
                <span className="lg:hidden">Settings</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
          <div className="text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Having trouble? Check our{" "}
              <Link
                href="/support/faq"
                className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium"
              >
                FAQ
              </Link>{" "}
              or{" "}
              <Link
                href="/support/contact"
                className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium"
              >
                contact support
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
