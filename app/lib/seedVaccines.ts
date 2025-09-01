import { cookies } from 'next/headers';

const BACKEND_URL = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL;

// Helper function to get auth token
async function getAuthToken() {
  const cookieStore = await cookies();
  return cookieStore.get('token')?.value;
}

export async function seedVaccines() {
  console.log('🌱 Seeding vaccines...');
  
  try {
    const token = await getAuthToken();
    
    if (!token) {
      console.error('❌ No authentication token found for vaccine seeding');
      throw new Error('Unauthorized');
    }

    // First check if vaccines already exist
    const checkQuery = `query { findAllVaccines { _id name } }`;
    const checkResponse = await fetch(BACKEND_URL!, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ query: checkQuery }),
    });

    if (checkResponse.ok) {
      const checkData = await checkResponse.json();
      const existingVaccines = checkData.data?.findAllVaccines || [];
      console.log('📋 Existing vaccines:', existingVaccines.map((v: any) => v.name));
      
      if (existingVaccines.length > 0) {
        console.log('✅ Vaccines already exist, skipping seeding');
        return;
      }
    }

    const vaccines = [
      { name: "DHP" },
      { name: "Parvovirus" },
      { name: "Rabies" }
    ];

    const mutation = `
      mutation CreateVaccine($createVaccineDto: CreateVaccineDto!) {
        createVaccine(createVaccineDto: $createVaccineDto) {
          _id
          name
        }
      }
    `;

    for (const vaccine of vaccines) {
      try {
        console.log(`🔧 Creating vaccine: ${vaccine.name}`);
        const response = await fetch(BACKEND_URL!, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            query: mutation,
            variables: { createVaccineDto: vaccine }
          }),
        });

        if (!response.ok) {
          console.error(`❌ Failed to create vaccine ${vaccine.name}: ${response.status}`);
          continue;
        }

        const data = await response.json();
        if (data.errors) {
          console.error(`❌ GraphQL errors creating vaccine ${vaccine.name}:`, data.errors);
          continue;
        }

        console.log(`✅ Created vaccine: ${vaccine.name}`);
      } catch (error) {
        console.error(`❌ Error creating vaccine ${vaccine.name}:`, error);
      }
    }

    console.log('✅ Vaccine seeding completed');
  } catch (error) {
    console.error('❌ Error in vaccine seeding:', error);
    throw error;
  }
}