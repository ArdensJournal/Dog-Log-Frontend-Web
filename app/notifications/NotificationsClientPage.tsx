'use client';

import { useEffect, useState } from 'react';
import { MdNotifications, MdCheckCircle, MdCircle, MdRefresh } from 'react-icons/md';
import { getFCMToken } from '@/app/lib/firebase';

interface Notification {
  _id: string;
  title: string;
  message: string;
  dog: string;
  isRead: boolean;
  createdAt: string;
  user: string;
}

export default function NotificationsClientPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [fcmToken, setFcmToken] = useState<string | null>(null);
  const [registering, setRegistering] = useState(false);

  // Fetch notifications
  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/notifications');
      const data = await response.json();
      
      if (response.ok) {
        setNotifications(data.notifications || []);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  // Register FCM token with backend
  const registerFCMToken = async (token: string) => {
    setRegistering(true);
    try {
      const response = await fetch('/api/notifications/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fcmToken: token }),
      });

      if (response.ok) {
        console.log('FCM token registered successfully');
        setFcmToken(token);
        localStorage.setItem('fcmToken', token);
      }
    } catch (error) {
      console.error('Error registering FCM token:', error);
    } finally {
      setRegistering(false);
    }
  };

  // Mark notification as read
  const markAsRead = async (notificationId: string) => {
    try {
      const response = await fetch('/api/notifications/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ notificationId, isRead: true }),
      });

      if (response.ok) {
        // Update local state
        setNotifications(prev =>
          prev.map(notif =>
            notif._id === notificationId ? { ...notif, isRead: true } : notif
          )
        );
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  // Initialize FCM on component mount
  useEffect(() => {
    // Check if token is already stored
    const storedToken = localStorage.getItem('fcmToken');
    if (storedToken) {
      setFcmToken(storedToken);
    } else {
      // Request FCM token
      getFCMToken().then(token => {
        if (token) {
          registerFCMToken(token);
        }
      });
    }

    // Fetch notifications
    fetchNotifications();
  }, []);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-xl">
                <MdNotifications className="text-3xl text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Notifications
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
            <button
              onClick={fetchNotifications}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-lg hover:bg-purple-200 dark:hover:bg-purple-800/50 transition disabled:opacity-50"
            >
              <MdRefresh className={`text-xl ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>

          {/* FCM Status */}
          {fcmToken ? (
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
              <p className="text-sm text-green-800 dark:text-green-200 flex items-center gap-2">
                <MdCheckCircle className="text-xl" />
                Push notifications enabled
              </p>
            </div>
          ) : (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                {registering ? 'Registering for push notifications...' : 'Push notifications not enabled'}
              </p>
            </div>
          )}
        </div>

        {/* Notifications List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading notifications...</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-12 text-center">
            <MdNotifications className="text-6xl text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              No Notifications
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              You're all caught up! Check back later for updates.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((notification) => (
              <div
                key={notification._id}
                onClick={() => !notification.isRead && markAsRead(notification._id)}
                className={`bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 cursor-pointer transition-all hover:shadow-lg ${
                  !notification.isRead
                    ? 'border-l-4 border-purple-500'
                    : 'opacity-75'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className={`mt-1 ${
                      notification.isRead
                        ? 'text-gray-300 dark:text-gray-600'
                        : 'text-purple-500'
                    }`}>
                      {notification.isRead ? (
                        <MdCheckCircle className="text-2xl" />
                      ) : (
                        <MdCircle className="text-2xl" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className={`font-semibold mb-1 ${
                        notification.isRead
                          ? 'text-gray-600 dark:text-gray-400'
                          : 'text-gray-900 dark:text-white'
                      }`}>
                        {notification.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-400 dark:text-gray-500">
                        {new Date(notification.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
