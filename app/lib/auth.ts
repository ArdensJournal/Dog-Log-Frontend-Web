'use client';

import { apiClient } from './api-client';

// Cache authentication state briefly to reduce API calls
let authCache: { result: { isAuthenticated: boolean; user: any | null }; timestamp: number } | null = null;
const CACHE_DURATION = 5000; // 5 seconds

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
  } catch (error) {
    console.error('Error during signout:', error);
    // Clear the cache even if signout fails
    authCache = null;
  }
}
