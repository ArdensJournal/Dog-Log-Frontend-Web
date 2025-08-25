'use client';

// Utility to check if user is properly authenticated
export async function checkAuthStatus(): Promise<{ isAuthenticated: boolean; user: any | null }> {
  if (typeof window === 'undefined') {
    return { isAuthenticated: false, user: null };
  }

  const token = localStorage.getItem('accessToken');
  if (!token) {
    return { isAuthenticated: false, user: null };
  }

  try {
    const res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL!, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        query: `
          query {
            whoAmI {
              _id
              name
              email
            }
          }
        `,
      }),
    });

    const json = await res.json();
    
    // If we get errors or no data, the token is invalid
    if (!res.ok || json.errors || !json.data?.whoAmI) {
      // Clear invalid tokens
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      return { isAuthenticated: false, user: null };
    }

    return { isAuthenticated: true, user: json.data.whoAmI };
  } catch (error) {
    // On any error, clear tokens and return not authenticated
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    return { isAuthenticated: false, user: null };
  }
}

// Simple token check (fast but doesn't verify with server)
export function hasValidToken(): boolean {
  if (typeof window === 'undefined') return false;
  return !!localStorage.getItem('accessToken');
}

// Clear authentication
export function clearAuth(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }
}
