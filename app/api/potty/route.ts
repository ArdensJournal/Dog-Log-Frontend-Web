import { NextRequest } from 'next/server';
import { cookies } from 'next/headers';

const BACKEND_URL = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL;

if (!BACKEND_URL) {
  console.error('❌ BACKEND_URL is not defined. Please set BACKEND_URL or NEXT_PUBLIC_BACKEND_URL environment variable');
}

// GET /api/potty - Get potty records for a dog
export async function GET(request: NextRequest) {
  console.log('🚽 GET /api/potty - Getting potty records');
  
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    
    if (!token) {
      console.log('❌ No authentication token found');
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get dogId from query parameters
    const { searchParams } = new URL(request.url);
    const dogId = searchParams.get('dogId');

    if (!dogId) {
      return Response.json({ error: 'Dog ID is required' }, { status: 400 });
    }

    console.log('🐕 Getting potty records for dog:', dogId);

    // First test if GraphQL endpoint is reachable with a simple query
    const testQuery = `
      query {
        sayHello
      }
    `;

    console.log('🧪 Testing GraphQL endpoint connectivity...');
    
    try {
      const testResponse = await fetch(BACKEND_URL!, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ query: testQuery }),
      });

      console.log('🧪 Test response status:', testResponse.status);
      if (testResponse.ok) {
        const testData = await testResponse.json();
        console.log('🧪 Test response:', testData);
      } else {
        const testError = await testResponse.text();
        console.log('🧪 Test error:', testError);
      }
    } catch (testErr) {
      console.log('🧪 Test connection error:', testErr);
    }

    // Now try the actual potty query
    console.log('🚀 Now trying potty query...');

    const query = `
      query FindPottyByDogId($findByDogIdDto: FindByDogIdDto!) {
        findPottyByDogId(findByDogIdDto: $findByDogIdDto) {
          _id
          date
          type
          environment
          healthFlags
          note
          coordinates {
            latitude
            longitude
          }
          addedBy {
            _id
            name
          }
          createdAt
        }
      }
    `;

    const variables = {
      findByDogIdDto: {
        dogId: dogId
      }
    };

    console.log('🚀 Sending query to backend:', JSON.stringify({ query, variables }, null, 2));

    const response = await fetch(BACKEND_URL!, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ query, variables }),
    });

    console.log('📡 Backend response status:', response.status);
    console.log('📡 Backend response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.log('❌ Backend error response:', errorText);
      console.log('❌ Request details:', {
        url: BACKEND_URL,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token?.substring(0, 20)}...`,
        },
        body: JSON.stringify({ query, variables })
      });
      return Response.json(
        { error: 'Failed to fetch potty records', details: errorText }, 
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('📄 Backend response data:', JSON.stringify(data, null, 2));

    if (data.errors) {
      console.log('❌ GraphQL errors:', data.errors);
      return Response.json(
        { error: 'GraphQL errors', details: data.errors }, 
        { status: 400 }
      );
    }

    return Response.json({
      records: data.data.findPottyByDogId,
      success: true
    });

  } catch (error) {
    console.error('💥 Error in /api/potty GET:', error);
    return Response.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' }, 
      { status: 500 }
    );
  }
}

// POST /api/potty - Create a new potty record
export async function POST(request: NextRequest) {
  console.log('🚽 POST /api/potty - Creating new potty record');
  
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    
    if (!token) {
      console.log('❌ No authentication token found');
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    console.log('📝 Request body:', JSON.stringify(body, null, 2));

    // Validate required fields
    if (!body.dog || !body.date || !body.type) {
      return Response.json({ 
        error: 'Missing required fields: dog, date, and type are required' 
      }, { status: 400 });
    }

    const mutation = `
      mutation CreatePotty($createPottyDto: CreatePottyDto!) {
        createPotty(createPottyDto: $createPottyDto) {
          _id
          date
          type
          environment
          healthFlags
          note
          coordinates {
            latitude
            longitude
          }
          addedBy {
            _id
            name
          }
          createdAt
        }
      }
    `;

    const variables = {
      createPottyDto: {
        dog: body.dog,
        date: body.date,
        type: body.type,
        environment: body.environment || null,
        healthFlags: body.healthFlags || [],
        note: body.note || null,
        coordinates: body.coordinates || null
      }
    };

    console.log('🚀 Sending mutation to backend:', JSON.stringify({ mutation, variables }, null, 2));

    const response = await fetch(BACKEND_URL!, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ query: mutation, variables }),
    });

    console.log('📡 Backend response status:', response.status);
    console.log('📡 Backend response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.log('❌ Backend error response:', errorText);
      console.log('❌ Request details:', {
        url: BACKEND_URL,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token?.substring(0, 20)}...`,
        },
        body: JSON.stringify({ query: mutation, variables })
      });
      return Response.json(
        { error: 'Failed to create potty record', details: errorText }, 
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('📄 Backend response data:', JSON.stringify(data, null, 2));

    if (data.errors) {
      console.log('❌ GraphQL errors:', data.errors);
      return Response.json(
        { error: 'GraphQL errors', details: data.errors }, 
        { status: 400 }
      );
    }

    return Response.json({
      data: data.data.createPotty,
      success: true,
      message: 'Potty record created successfully'
    });

  } catch (error) {
    console.error('💥 Error in /api/potty POST:', error);
    return Response.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' }, 
      { status: 500 }
    );
  }
}
