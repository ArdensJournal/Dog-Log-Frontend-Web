import { NextRequest } from 'next/server';
import { cookies } from 'next/headers';

const BACKEND_URL = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL;

if (!BACKEND_URL) {
  console.error('❌ BACKEND_URL is not defined. Please set BACKEND_URL or NEXT_PUBLIC_BACKEND_URL environment variable');
}

// POST /api/auth/signin - Sign in user
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return Response.json(
        { error: 'Email and password are required' }, 
        { status: 400 }
      );
    }

    const mutation = `
      mutation SignInByCredentials($signInByCredentialsDto: SignInOrSignUpByCredentialsDto!) {
        signInByCredentials(signInByCredentialsDto: $signInByCredentialsDto) {
          accessToken
          refreshToken
        }
      }
    `;

    const response = await fetch(BACKEND_URL!, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: mutation,
        variables: { 
          signInByCredentialsDto: { email, password }
        }
      }),
    });

    if (!response.ok) {
      return Response.json(
        { error: 'Failed to sign in' }, 
        { status: response.status }
      );
    }

    const data = await response.json();

    if (data.errors) {
      return Response.json(
        { error: 'Sign in failed', details: data.errors }, 
        { status: 401 }
      );
    }

    // Set HTTP-only cookie with the token
    const cookieStore = await cookies();
    cookieStore.set('token', data.data.signInByCredentials.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    // Also store refresh token if needed
    cookieStore.set('refreshToken', data.data.signInByCredentials.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });

    // Get user info using whoAmI query
    const userQuery = `
      query WhoAmI {
        whoAmI {
          _id
          name
          email
          profileImageUrl
        }
      }
    `;

    const userResponse = await fetch(BACKEND_URL!, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${data.data.signInByCredentials.accessToken}`,
      },
      body: JSON.stringify({ query: userQuery }),
    });

    let user = null;
    if (userResponse.ok) {
      const userData = await userResponse.json();
      if (!userData.errors) {
        user = userData.data.whoAmI;
      }
    }

    // Return user data (without token for security)
    return Response.json({
      user: user,
      message: 'Signed in successfully'
    });

  } catch (error) {
    console.error('Error in /api/auth/signin:', error);
    return Response.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}
