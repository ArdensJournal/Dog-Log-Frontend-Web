'use server';

import { cookies } from 'next/headers';
import { revalidatePath, revalidateTag } from 'next/cache';

const BACKEND_URL = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL;

if (!BACKEND_URL) {
  throw new Error('BACKEND_URL is not defined');
}

async function getAuthToken() {
  const cookieStore = await cookies();
  return cookieStore.get('token')?.value;
}

// Server action to get all vaccines
export async function getVaccines() {
  try {
    const token = await getAuthToken();
    
    if (!token) {
      return [];
    }

    const query = `
      query GetVaccines {
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
      next: { tags: ['vaccines'] } // Cache tag for revalidation
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Failed to fetch vaccines:', response.status, errorText);
      return [];
    }

    const data = await response.json();
    console.log('Vaccines response:', data);
    
    if (data.errors) {
      console.error('GraphQL errors:', data.errors);
      return [];
    }

    const vaccines = data.data.findAllVaccines || [];
    console.log('Fetched vaccines count:', vaccines.length);
    return vaccines;
  } catch (error) {
    console.error('Error fetching vaccines:', error);
    return [];
  }
}

// Server action to get vaccinations for a dog
export async function getVaccinations(dogId: string) {
  try {
    const token = await getAuthToken();
    
    if (!token) {
      return [];
    }

    const query = `
      query GetVaccinations($dogId: ID!) {
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

    const response = await fetch(BACKEND_URL!, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        query,
        variables: { dogId }
      }),
      next: { tags: [`vaccinations-${dogId}`] } // Cache tag for specific dog's vaccinations
    });

    if (!response.ok) {
      console.error('Failed to fetch vaccinations:', response.status);
      return [];
    }

    const data = await response.json();
    
    if (data.errors) {
      console.error('GraphQL errors:', data.errors);
      return [];
    }

    return data.data.findAllVaccineRecordsByDog || [];
  } catch (error) {
    console.error('Error fetching vaccinations:', error);
    return [];
  }
}

// Server action to create a vaccination record
export async function createVaccination(vaccinationData: {
  dogId: string;
  vaccineId: string;
  dateGiven: string;
  nextDueDate?: string;
  administeredBy?: string;
  notes?: string;
}) {
  try {
    const token = await getAuthToken();
    
    if (!token) {
      throw new Error('Authentication required');
    }

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

    const response = await fetch(BACKEND_URL!, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        query: mutation,
        variables: { 
          createVaccineRecordDto: { 
            dog: vaccinationData.dogId,
            vaccine: vaccinationData.vaccineId, // This should be the enum value (DHP, Parvovirus, or Rabies)
            date: vaccinationData.dateGiven,
            note: vaccinationData.notes || "",
            validFor: { unit: "Years", value: 1 } // Default value since frontend doesn't capture this
          }
        }
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to create vaccination: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.errors) {
      throw new Error(`GraphQL errors: ${JSON.stringify(data.errors)}`);
    }

    // Revalidate vaccinations data
    revalidateTag(`vaccinations-${vaccinationData.dogId}`);
    revalidatePath('/vaccinations');
    revalidatePath('/recent-activity');
    
    return data.data.createVaccineRecord;
  } catch (error) {
    console.error('Error creating vaccination:', error);
    throw error;
  }
}

// Server action to update a vaccination record
export async function updateVaccination(vaccinationId: string, updates: any) {
  try {
    const token = await getAuthToken();
    
    if (!token) {
      throw new Error('Authentication required');
    }

    // TODO: Implement when backend supports vaccine record updates
    throw new Error('Update vaccination not yet implemented');
  } catch (error) {
    console.error('Error updating vaccination:', error);
    throw error;
  }
}

// Server action to delete a vaccination record
export async function deleteVaccination(vaccinationId: string, dogId: string) {
  try {
    const token = await getAuthToken();
    
    if (!token) {
      throw new Error('Authentication required');
    }

    // TODO: Implement when backend supports vaccine record deletion
    throw new Error('Delete vaccination not yet implemented');
  } catch (error) {
    console.error('Error deleting vaccination:', error);
    throw error;
  }
}
