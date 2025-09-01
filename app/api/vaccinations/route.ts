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

// GET /api/vaccinations - Fetch all vaccinations for user's dogs
export async function GET() {
  try {
    const token = await getAuthToken();
    
    if (!token) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // First get the user's dogs
    const dogsQuery = `
      query GetUserDogs {
        userDogs {
          _id
          name
        }
      }
    `;

    const dogsResponse = await fetch(BACKEND_URL!, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ query: dogsQuery }),
    });

    if (!dogsResponse.ok) {
      console.error('Failed to fetch dogs:', dogsResponse.status);
      return Response.json(
        { error: 'Failed to fetch dogs from backend' }, 
        { status: dogsResponse.status }
      );
    }

    const dogsData = await dogsResponse.json();
    if (dogsData.errors) {
      console.error('GraphQL errors fetching dogs:', dogsData.errors);
      return Response.json(
        { error: 'GraphQL query failed', details: dogsData.errors }, 
        { status: 400 }
      );
    }

    const userDogs = dogsData.data?.userDogs || [];
    
    // Now fetch vaccinations for each dog
    const dogsWithVaccinations = await Promise.all(
      userDogs.map(async (dog: any) => {
        try {
          const vaccinationsQuery = `
            query FindVaccinationsByDog($dogId: ID!) {
              findAllVaccineRecordsByDog(findByDogIdDto: { dogId: $dogId }) {
                _id
                date
                note
                createdAt
                updatedAt
                vaccine {
                  _id
                  name
                }
                validFor {
                  unit
                  value
                }
              }
            }
          `;

          const vaccResponse = await fetch(BACKEND_URL!, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ 
              query: vaccinationsQuery, 
              variables: { dogId: dog._id } 
            }),
          });

          if (!vaccResponse.ok) {
            console.error(`Failed to fetch vaccinations for dog ${dog._id}`);
            return { ...dog, vaccinations: [] };
          }

          const vaccData = await vaccResponse.json();
          if (vaccData.errors) {
            console.error(`GraphQL errors fetching vaccinations for dog ${dog._id}:`, vaccData.errors);
            return { ...dog, vaccinations: [] };
          }

          const vaccinations = vaccData.data?.findAllVaccineRecordsByDog || [];
          
          // Map to the expected format
          const mappedVaccinations = vaccinations.map((v: any) => ({
            _id: v._id,
            vaccine: v.vaccine,
            dateGiven: v.date,
            notes: v.note,
            administeredBy: undefined,
            nextDueDate: undefined,
            createdAt: v.createdAt
          }));

          return { ...dog, vaccinations: mappedVaccinations };
        } catch (error) {
          console.error(`Error fetching vaccinations for dog ${dog._id}:`, error);
          return { ...dog, vaccinations: [] };
        }
      })
    );

    return Response.json({ data: { userDogs: dogsWithVaccinations } });

  } catch (error) {
    console.error('Error in /api/vaccinations GET:', error);
    return Response.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}

// POST /api/vaccinations - Add new vaccination
export async function POST(request: NextRequest) {
  console.log('💉 POST /api/vaccinations - Creating new vaccination');
  
  try {
    const token = await getAuthToken();
    
    if (!token) {
      console.log('❌ No authentication token found for vaccination creation');
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('✅ Authentication token found for vaccination creation');

    const body = await request.json();
    console.log('📄 Request body:', body);
    const { dogId, vaccineId, dateGiven, notes, administeredBy, nextDueDate } = body;

    const mutation = `
      mutation CreateVaccineRecord($createVaccineRecordDto: CreateVaccineRecordDto!) {
        createVaccineRecord(createVaccineRecordDto: $createVaccineRecordDto) {
          _id
          vaccine {
            _id
            name
          }
          date
          note
          createdAt
          validFor {
            unit
            value
          }
        }
      }
    `;

    const variables = { 
      createVaccineRecordDto: { 
        dog: dogId,
        vaccine: vaccineId,
        date: dateGiven,
        note: notes,
        validFor: { unit: "Years", value: 1 } // Default value since frontend doesn't capture this
      }
    };

    console.log('🚀 Sending createVaccination mutation:', JSON.stringify(variables, null, 2));

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

    console.log('📡 Backend createVaccination response status:', response.status);
    const responseText = await response.text();
    console.log('📄 Backend createVaccination response text:', responseText);

    if (!response.ok) {
      console.error('❌ Backend createVaccination request failed:', response.status, responseText);
      return Response.json(
        { error: 'Failed to add vaccination', details: responseText }, 
        { status: response.status }
      );
    }

    let data;
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      console.error('❌ Failed to parse createVaccination response as JSON:', parseError);
      return Response.json(
        { error: 'Invalid response from backend', details: responseText }, 
        { status: 500 }
      );
    }

    if (data.errors) {
      console.error('❌ GraphQL errors in createVaccination:', data.errors);
      return Response.json(
        { error: 'GraphQL mutation failed', details: data.errors }, 
        { status: 400 }
      );
    }

    console.log('✅ Vaccination created successfully:', data);
    return Response.json(data, { status: 201 });

  } catch (error) {
    console.error('❌ Error in /api/vaccinations POST:', error);
    return Response.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}
