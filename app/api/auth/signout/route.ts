import { NextRequest } from 'next/server';
import { cookies } from 'next/headers';

// POST /api/auth/signout - Sign out user
export async function POST() {
  try {
    // Clear the token cookie
    const cookieStore = await cookies();
    cookieStore.delete('token');

    return Response.json({
      message: 'Signed out successfully'
    });

  } catch (error) {
    console.error('Error in /api/auth/signout:', error);
    return Response.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}
