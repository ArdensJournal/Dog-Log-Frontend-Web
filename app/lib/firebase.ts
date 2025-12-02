import { initializeApp, getApps } from "firebase/app";
import {
  getMessaging,
  getToken,
  onMessage,
  isSupported,
} from "firebase/messaging";

// Your Firebase configuration
// You'll need to get these values from Firebase Console
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
const app =
  getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Get FCM Token
export async function getFCMToken(): Promise<string | null> {
  try {
    // Check if messaging is supported
    const messagingSupported = await isSupported();
    if (!messagingSupported) {
      console.log("Firebase Messaging is not supported in this browser");
      return null;
    }

    const messaging = getMessaging(app);

    // Request notification permission
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      console.log("Notification permission denied");
      return null;
    }

    // Get FCM token
    const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;
    if (!vapidKey) {
      console.error("VAPID key is not configured");
      return null;
    }

    const token = await getToken(messaging, { vapidKey });
    console.log("FCM Token:", token);
    return token;
  } catch (error) {
    console.error("Error getting FCM token:", error);
    return null;
  }
}

// Listen for foreground messages
export function onMessageListener() {
  return new Promise((resolve) => {
    isSupported().then((supported) => {
      if (supported) {
        const messaging = getMessaging(app);
        onMessage(messaging, (payload) => {
          console.log("Message received:", payload);
          resolve(payload);
        });
      }
    });
  });
}

export { app };
