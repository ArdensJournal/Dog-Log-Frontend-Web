import { NextRequest } from 'next/server';
import { cookies } from 'next/headers';

// POST /api/auth/google-callback - Handle Google OAuth tokens
export async function POST(request: NextRequest) {
  console.log('🔄 Google OAuth callback - Setting tokens as HTTP-only cookies');
  
  try {
    const { accessToken, refreshToken } = await request.json();
    
    if (!accessToken || !refreshToken) {
      console.log('❌ Missing tokens in Google callback');
      return Response.json({ error: 'Missing tokens' }, { status: 400 });
    }

    console.log('✅ Tokens received from Google OAuth');
    console.log('🔑 Access token:', accessToken.substring(0, 50) + '...');
    console.log('🔄 Refresh token:', refreshToken.substring(0, 50) + '...');

    // Set the access token as HTTP-only cookie (same as our signin endpoint)
    const cookieStore = await cookies();
    
    // Set access token cookie (7 days)
    cookieStore.set('token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/',
    });

    // Optionally set refresh token cookie (30 days) for future token refreshing
    cookieStore.set('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: '/',
    });

    console.log('🍪 HTTP-only cookies set successfully');

    return Response.json({ 
      success: true, 
      message: 'Authentication tokens set successfully' 
    });

  } catch (error) {
    console.error('❌ Error in Google OAuth callback:', error);
    return Response.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}
