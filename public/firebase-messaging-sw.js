// Firebase messaging service worker
// This file handles background notifications

importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

// Initialize Firebase in the service worker
firebase.initializeApp({
  apiKey: "AIzaSyC7iwWcSs7qxibQLbgi2O2MhIHdqNdMIcc",
  authDomain: "dog-log-131a0.firebaseapp.com",
  projectId: "dog-log-131a0",
  storageBucket: "dog-log-131a0.firebasestorage.app",
  messagingSenderId: "430112147803",
  appId: "1:430112147803:web:6bbbc39e35725a84da327e"
});

const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log('Received background message:', payload);

  const notificationTitle = payload.notification?.title || 'New Notification';
  const notificationOptions = {
    body: payload.notification?.body || 'You have a new notification',
    icon: '/doglog-logo.png',
    badge: '/doglog-logo.png',
    data: payload.data,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  console.log('Notification clicked:', event);
  event.notification.close();

  // Navigate to the app
  event.waitUntil(
    clients.openWindow('/')
  );
});
