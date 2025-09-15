'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

const BACKEND_URL = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL;

if (!BACKEND_URL) {
  throw new Error('BACKEND_URL is not defined. Please set BACKEND_URL or NEXT_PUBLIC_BACKEND_URL environment variable');
}

// Server action to get current user (read-only, safe for Server Components)
export async function getCurrentUser() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    
    if (!token) {
      return null;
    }

    const query = `
      query WhoAmI {
        whoAmI {
          _id
          name
          email
          profileImageUrl
        }
      }
    `;

    const response = await fetch(BACKEND_URL!, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ query }),
      next: { tags: ['user'] } // Cache tag for revalidation
    });

    if (!response.ok) {
      // Don't modify cookies in a Server Component - just return null
      return null;
    }

    const data = await response.json();
    
    if (data.errors) {
      // Don't modify cookies in a Server Component - just return null
      return null;
    }

    return data.data.whoAmI;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}

// Server action to clear invalid token (for use in client components)
export async function clearInvalidToken() {
  const cookieStore = await cookies();
  cookieStore.delete('token');
  revalidatePath('/');
}

// Server action to sign out
export async function signOut() {
  const cookieStore = await cookies();
  cookieStore.delete('token');
  revalidatePath('/');
  redirect('/');
}

// Server action to authenticate user and set cookie
export async function authenticateUser(token: string) {
  const cookieStore = await cookies();
  cookieStore.set('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 // 7 days
  });
  
  // Revalidate user-related paths
  revalidatePath('/');
  revalidatePath('/dashboard');
}
