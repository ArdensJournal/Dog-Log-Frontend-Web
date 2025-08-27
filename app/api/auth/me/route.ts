import { NextRequest } from 'next/server';
import { cookies } from 'next/headers';

const BACKEND_URL = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL;

if (!BACKEND_URL) {
  console.error('❌ BACKEND_URL is not defined. Please set BACKEND_URL or NEXT_PUBLIC_BACKEND_URL environment variable');
}

// GET /api/auth/me - Get current user info
export async function GET() {
  console.log('👤 GET /api/auth/me - Getting current user info');
  
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    
    console.log('🍪 Token from cookies:', token ? `${token.substring(0, 20)}...` : 'No token found');
    
    if (!token) {
      console.log('❌ No authentication token found in cookies');
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('✅ Authentication token found, querying backend...');

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

    console.log('🚀 Sending whoAmI query to backend...');
    const response = await fetch(BACKEND_URL!, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ query }),
    });

    console.log('📡 Backend response status:', response.status);
    
    if (!response.ok) {
      console.log('❌ Backend response not OK:', response.status);
      const errorText = await response.text();
      console.log('📄 Backend error response:', errorText);
      
      // If unauthorized, clear the cookie
      if (response.status === 401) {
        console.log('🧹 Clearing invalid token cookie');
        const cookieStore = await cookies();
        cookieStore.delete('token');
      }
      return Response.json(
        { error: 'Failed to get user info', details: errorText }, 
        { status: response.status }
      );
    }

    const responseText = await response.text();
    console.log('📄 Backend response text:', responseText);
    
    const data = JSON.parse(responseText);

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
