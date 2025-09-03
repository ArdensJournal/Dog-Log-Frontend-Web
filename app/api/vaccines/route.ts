import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const BACKEND_URL = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL;

if (!BACKEND_URL) {
  console.error('❌ BACKEND_URL is not defined. Please set BACKEND_URL or NEXT_PUBLIC_BACKEND_URL environment variable');
}

// Helper function to get auth token
async function getAuthToken() {
  const cookieStore = await cookies();
  return cookieStore.get('token')?.value;
}

// GET /api/vaccines - Fetch all vaccines
export async function GET() {
  try {
    const token = await getAuthToken();
    
    if (!token) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const query = `
      query GetAllVaccines {
        findAllVaccines {
          _id
          name
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

    console.log('🌐 Vaccines backend response status:', response.status);
    const responseText = await response.text();
    console.log('📄 Vaccines backend response text:', responseText);

    if (!response.ok) {
      console.error('Backend response not OK:', response.status);
      return Response.json(
        { error: 'Failed to fetch vaccines from backend', details: responseText }, 
        { status: response.status }
      );
    }

    let data;
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      console.error('Failed to parse vaccines response as JSON:', parseError);
      return Response.json(
        { error: 'Invalid JSON response from backend', details: responseText }, 
        { status: 500 }
      );
    }

    if (data.errors) {
      console.error('GraphQL errors:', data.errors);
      return Response.json(
        { error: 'GraphQL query failed', details: data.errors }, 
        { status: 400 }
      );
    }

    return Response.json(data);

  } catch (error) {
    console.error('Error in /api/vaccines GET:', error);
    return Response.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}
