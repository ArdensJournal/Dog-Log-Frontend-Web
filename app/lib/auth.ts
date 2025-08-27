'use client';

import { apiClient } from './api-client';

// Cache authentication state briefly to reduce API calls
let authCache: { result: { isAuthenticated: boolean; user: any | null }; timestamp: number } | null = null;
const CACHE_DURATION = 5000; // 5 seconds

// Event system for auth state changes
const AUTH_CHANGED_EVENT = 'authStateChanged';

// Function to notify all components about auth state changes
export function notifyAuthStateChanged() {
  if (typeof window !== 'undefined') {
    // Clear the cache immediately
    authCache = null;
    
    // Dispatch custom event
    window.dispatchEvent(new CustomEvent(AUTH_CHANGED_EVENT));
    
    // Also trigger storage event for cross-tab compatibility
    window.dispatchEvent(new StorageEvent('storage', {
      key: 'auth-state-changed',
      newValue: Date.now().toString(),
      storageArea: localStorage
    }));
  }
}

// Function to listen for auth state changes
export function onAuthStateChanged(callback: () => void) {
  if (typeof window === 'undefined') return () => {};
  
  const handleAuthChange = () => callback();
  
  // Listen to custom event
  window.addEventListener(AUTH_CHANGED_EVENT, handleAuthChange);
  
  // Listen to storage events for cross-tab changes
  window.addEventListener('storage', (e) => {
    if (e.key === 'auth-state-changed') {
      handleAuthChange();
    }
  });
  
  // Return cleanup function
  return () => {
    window.removeEventListener(AUTH_CHANGED_EVENT, handleAuthChange);
    window.removeEventListener('storage', handleAuthChange);
  };
}

// Utility to check if user is properly authenticated
export async function checkAuthStatus(): Promise<{ isAuthenticated: boolean; user: any | null }> {
  if (typeof window === 'undefined') {
    return { isAuthenticated: false, user: null };
  }

  // Use cached result if it's recent
  if (authCache && Date.now() - authCache.timestamp < CACHE_DURATION) {
    return authCache.result;
  }

  try {
    const result = await apiClient.getCurrentUser();
    const authResult = { isAuthenticated: result.isAuthenticated, user: result.user };
    
    // Cache the result
    authCache = { result: authResult, timestamp: Date.now() };
    
    return authResult;
  } catch (error) {
    // Silently handle expected authentication failures
    const authResult = { isAuthenticated: false, user: null };
    
    // Cache negative results too, but for a shorter time
    authCache = { result: authResult, timestamp: Date.now() - CACHE_DURATION + 1000 }; // Cache for 1 second
    
    return authResult;
  }
}

// Simple token check (now checks HTTP-only cookies via API)
export async function hasValidToken(): Promise<boolean> {
  if (typeof window === 'undefined') return false;
  try {
    const result = await checkAuthStatus(); // Use cached version
    return result.isAuthenticated;
  } catch (error) {
    // Silently handle expected authentication failures
    return false;
  }
}

// Clear authentication
export async function clearAuth(): Promise<void> {
  try {
    await apiClient.signout();
    // Clear the cache when signing out
    authCache = null;
    // Notify components about auth state change
    notifyAuthStateChanged();
  } catch (error) {
    console.error('Error during signout:', error);
    // Clear the cache even if signout fails
    authCache = null;
    // Still notify about state change
    notifyAuthStateChanged();
  }
}
