'use client';

import { apiClient } from './api-client';

// Utility to check if user is properly authenticated
export async function checkAuthStatus(): Promise<{ isAuthenticated: boolean; user: any | null }> {
  if (typeof window === 'undefined') {
    return { isAuthenticated: false, user: null };
  }

  try {
    const result = await apiClient.getCurrentUser();
    return { isAuthenticated: result.isAuthenticated, user: result.user };
  } catch (error) {
    return { isAuthenticated: false, user: null };
  }
}

// Simple token check (now checks HTTP-only cookies via API)
export async function hasValidToken(): Promise<boolean> {
  if (typeof window === 'undefined') return false;
  try {
    const result = await apiClient.getCurrentUser();
    return result.isAuthenticated;
  } catch (error) {
    return false;
  }
}

// Clear authentication
export async function clearAuth(): Promise<void> {
  try {
    await apiClient.signout();
  } catch (error) {
    console.error('Error during signout:', error);
    // Continue anyway
  }
}
