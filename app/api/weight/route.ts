import { cookies } from 'next/headers';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3456';

console.log('🌐 Backend URL configured as:', BACKEND_URL);

// Helper function to get auth token
async function getAuthToken() {
  const cookieStore = await cookies();
  return cookieStore.get('token')?.value;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const dogId = searchParams.get('dogId');

    if (!dogId) {
      return Response.json({ error: 'Dog ID is required' }, { status: 400 });
    }

    // Get auth token from cookies
    const token = await getAuthToken();

    if (!token) {
      return Response.json({ error: 'Authentication required' }, { status: 401 });
    }

    console.log(`🔄 Fetching weight records for dog: ${dogId}`);
    console.log(`🌐 Making request to: ${BACKEND_URL}/graphql`);
    console.log(`🔑 Using token: ${token ? 'Present' : 'Missing'}`);

    // GraphQL query to fetch weight records for a specific dog
    const query = `
      query FindWeightsByDog($dogId: ID!) {
        findWeightsByDog(findByDogIdDto: { dogId: $dogId }) {
          _id
          value
          date
          createdAt
          addedBy {
            _id
            name
          }
        }
      }
    `;

    const response = await fetch(`${BACKEND_URL}/graphql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        query,
        variables: { dogId },
      }),
    });

    console.log(`📡 Backend response status: ${response.status}`);

    if (!response.ok) {
      console.error('Backend response not OK:', response.status);
      const errorText = await response.text();
      console.error('Backend error details:', errorText);
      return Response.json(
        { 
          error: 'Failed to fetch weight records from backend', 
          details: `Backend returned ${response.status}`,
          backend_url: BACKEND_URL 
        },
        { status: response.status }
      );
    }

    const result = await response.json();

    if (result.errors) {
      console.error('GraphQL errors:', result.errors);
      return Response.json(
        { error: 'GraphQL query failed', details: result.errors },
        { status: 400 }
      );
    }

    const weightRecords = result.data?.findWeightsByDog || [];
    console.log(`✅ Fetched ${weightRecords.length} weight records for dog ${dogId}`);

    return Response.json({
      success: true,
      data: weightRecords,
    });

  } catch (error) {
    console.error('Error fetching weight records:', error);
    return Response.json(
      { 
        error: 'Internal server error', 
        details: error instanceof Error ? error.message : 'Unknown error',
        backend_url: BACKEND_URL
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const weightData = await request.json();

    // Get auth token from cookies
    const token = await getAuthToken();

    if (!token) {
      return Response.json({ error: 'Authentication required' }, { status: 401 });
    }

    console.log('🔄 Creating weight record:', weightData);
    console.log(`🌐 Making request to: ${BACKEND_URL}/graphql`);
    console.log(`🔑 Using token: ${token ? 'Present' : 'Missing'}`);

    // GraphQL mutation to create a new weight record
    const mutation = `
      mutation CreateWeight($createWeightDto: CreateWeightDto!) {
        createWeight(createWeightDto: $createWeightDto) {
          _id
          value
          date
          createdAt
          addedBy {
            _id
            name
          }
        }
      }
    `;

    const response = await fetch(`${BACKEND_URL}/graphql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        query: mutation,
        variables: {
          createWeightDto: weightData,
        },
      }),
    });

    console.log(`📡 Backend response status: ${response.status}`);

    if (!response.ok) {
      console.error('Backend response not OK:', response.status);
      const errorText = await response.text();
      console.error('Backend error details:', errorText);
      return Response.json(
        { 
          error: 'Failed to create weight record in backend', 
          details: `Backend returned ${response.status}`,
          backend_url: BACKEND_URL 
        },
        { status: response.status }
      );
    }

    const result = await response.json();

    if (result.errors) {
      console.error('GraphQL errors:', result.errors);
      return Response.json(
        { error: 'GraphQL mutation failed', details: result.errors },
        { status: 400 }
      );
    }

    const createdRecord = result.data?.createWeight;
    console.log('✅ Weight record created:', createdRecord);

    return Response.json({
      success: true,
      data: createdRecord,
    });

  } catch (error) {
    console.error('Error creating weight record:', error);
    return Response.json(
      { 
        error: 'Internal server error', 
        details: error instanceof Error ? error.message : 'Unknown error',
        backend_url: BACKEND_URL
      },
      { status: 500 }
    );
  }
}
