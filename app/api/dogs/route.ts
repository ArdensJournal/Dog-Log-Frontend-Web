import { NextRequest } from 'next/server';
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

// GET /api/dogs - Fetch all user dogs
export async function GET() {
  try {
    const token = await getAuthToken();
    
    if (!token) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const query = `
      query GetUserDogs {
        userDogs {
          _id
          name
          birthday
          breed
          gender
          imageUrl
          collaborators {
            role
            user {
              _id
              name
              email
            }
          }
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
      console.error('Backend response not OK:', response.status);
      return Response.json(
        { error: 'Failed to fetch dogs from backend' }, 
        { status: response.status }
      );
    }

    const data = await response.json();

    if (data.errors) {
      console.error('GraphQL errors:', data.errors);
      return Response.json(
        { error: 'GraphQL query failed', details: data.errors }, 
        { status: 400 }
      );
    }

    return Response.json(data);

  } catch (error) {
    console.error('Error in /api/dogs GET:', error);
    return Response.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}

// POST /api/dogs - Add new dog
export async function POST(request: NextRequest) {
  console.log('🐕 POST /api/dogs - Creating new dog');
  
  try {
    const token = await getAuthToken();
    
    if (!token) {
      console.log('❌ No authentication token found for dog creation');
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('✅ Authentication token found for dog creation');

    // Check if request is multipart (contains file)
    const contentType = request.headers.get('content-type');
    console.log('📝 Content-Type:', contentType);
    
    if (contentType?.includes('multipart/form-data')) {
      // Handle file upload
      console.log('🔧 Processing multipart request with file...');
      const formData = await request.formData();
      
      const operations = formData.get('operations') as string;
      const map = formData.get('map') as string;
      const file = formData.get('0') as File;

      console.log('📄 Multipart operations:', operations);
      console.log('📄 Multipart map:', map);
      console.log('📄 Multipart file:', file ? `${file.name} (${file.size} bytes)` : 'No file');

      if (!operations) {
        console.error('❌ No operations found in multipart request');
        return Response.json(
          { error: 'No GraphQL operations found in multipart request' }, 
          { status: 400 }
        );
      }

      // Create new FormData for backend
      const backendFormData = new FormData();
      backendFormData.append('operations', operations);
      backendFormData.append('map', map);
      if (file) {
        backendFormData.append('0', file);
      }

      console.log('🚀 Sending multipart createDog request to backend...');
      const response = await fetch(BACKEND_URL!, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'x-apollo-operation-name': 'CreateDog', // CSRF protection header
          'apollo-require-preflight': 'true', // Additional CSRF header
        },
        body: backendFormData,
      });

      console.log('📡 Backend createDog response status:', response.status);
      const responseText = await response.text();
      console.log('📄 Backend createDog response text:', responseText);

      if (!response.ok) {
        console.error('❌ Backend createDog request failed:', response.status, responseText);
        return Response.json(
          { error: 'Failed to create dog with file', details: responseText }, 
          { status: response.status }
        );
      }

      try {
        const data = JSON.parse(responseText);
        console.log('✅ Dog created successfully with multipart:', data);
        return Response.json(data, { status: 201 });
      } catch (parseError) {
        console.error('❌ Failed to parse createDog response as JSON:', parseError);
        return Response.json(
          { error: 'Invalid response from backend', details: responseText }, 
          { status: 500 }
        );
      }

    } else {
      // Handle regular JSON creation (no file)
      console.log('🔧 Processing regular JSON request...');
      const body = await request.json();
      console.log('📄 Request body:', body);
      const { name, breed, birthday, gender, image } = body;

      // Convert breed string to array if needed
      const breedArray = Array.isArray(breed) ? breed : [breed];
      console.log('📝 Processed breed array:', breedArray);

      const mutation = `
        mutation CreateDog($createDogDto: CreateDogDto!) {
          createDog(createDogDto: $createDogDto) {
            _id
            name
            breed
            birthday
            gender
            imageUrl
          }
        }
      `;

      const variables = { 
        createDogDto: { 
          name, 
          breed: breedArray, 
          birthday, 
          gender,
          ...(image && { image })
        }
      };

      console.log('🚀 Sending JSON createDog mutation:', JSON.stringify(variables, null, 2));

      const response = await fetch(BACKEND_URL!, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          query: mutation,
          variables
        }),
      });

      console.log('📡 Backend createDog response status:', response.status);
      const responseText = await response.text();
      console.log('📄 Backend createDog response text:', responseText);

      if (!response.ok) {
        console.error('❌ Backend createDog request failed:', response.status, responseText);
        return Response.json(
          { error: 'Failed to add dog', details: responseText }, 
          { status: response.status }
        );
      }

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('❌ Failed to parse createDog response as JSON:', parseError);
        return Response.json(
          { error: 'Invalid response from backend', details: responseText }, 
          { status: 500 }
        );
      }

      if (data.errors) {
        console.error('❌ GraphQL errors in createDog:', data.errors);
        return Response.json(
          { error: 'GraphQL mutation failed', details: data.errors }, 
          { status: 400 }
        );
      }

      console.log('✅ Dog created successfully with JSON:', data);
      return Response.json(data, { status: 201 });
    }

  } catch (error) {
    console.error('❌ Error in /api/dogs POST:', error);
    return Response.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}
