import { NextRequest } from 'next/server';
import { cookies } from 'next/headers';

const BACKEND_URL = process.env.BACKEND_URL;

if (!BACKEND_URL) {
  throw new Error('BACKEND_URL is not defined in environment variables');
}

// GET /api/auth/me - Get current user info
export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    
    if (!token) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
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
    });

    if (!response.ok) {
      // If unauthorized, clear the cookie
      if (response.status === 401) {
        cookieStore.delete('token');
      }
      return Response.json(
        { error: 'Failed to get user info' }, 
        { status: response.status }
      );
    }

    const data = await response.json();

    if (data.errors) {
      // If unauthorized, clear the cookie
      cookieStore.delete('token');
      return Response.json(
        { error: 'Authentication failed', details: data.errors }, 
        { status: 401 }
      );
    }

    return Response.json({
      user: data.data.whoAmI,
      isAuthenticated: true
    });

  } catch (error) {
    console.error('Error in /api/auth/me:', error);
    return Response.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}
