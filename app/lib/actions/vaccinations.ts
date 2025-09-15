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
        vaccines {
          _id
          name
          description
          recommendedFrequency
          ageCategory
          isCore
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
      console.error('Failed to fetch vaccines:', response.status);
      return [];
    }

    const data = await response.json();
    
    if (data.errors) {
      console.error('GraphQL errors:', data.errors);
      return [];
    }

    return data.data.vaccines || [];
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
        vaccinations(dogId: $dogId) {
          _id
          dogId
          vaccineId
          vaccine {
            _id
            name
            description
          }
          dateGiven
          nextDueDate
          administeredBy
          notes
          createdAt
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

    return data.data.vaccinations || [];
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
      mutation CreateVaccination($input: CreateVaccinationInput!) {
        createVaccination(input: $input) {
          _id
          dogId
          vaccineId
          vaccine {
            _id
            name
            description
          }
          dateGiven
          nextDueDate
          administeredBy
          notes
          createdAt
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
        variables: { input: vaccinationData }
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
    
    return data.data.createVaccination;
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

    const mutation = `
      mutation UpdateVaccination($id: ID!, $input: UpdateVaccinationInput!) {
        updateVaccination(id: $id, input: $input) {
          _id
          dogId
          vaccineId
          vaccine {
            _id
            name
            description
          }
          dateGiven
          nextDueDate
          administeredBy
          notes
          createdAt
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
        variables: { id: vaccinationId, input: updates }
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to update vaccination: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.errors) {
      throw new Error(`GraphQL errors: ${JSON.stringify(data.errors)}`);
    }

    const vaccination = data.data.updateVaccination;

    // Revalidate vaccinations data
    revalidateTag(`vaccinations-${vaccination.dogId}`);
    revalidatePath('/vaccinations');
    revalidatePath('/recent-activity');
    
    return vaccination;
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

    const mutation = `
      mutation DeleteVaccination($id: ID!) {
        deleteVaccination(id: $id)
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
        variables: { id: vaccinationId }
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to delete vaccination: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.errors) {
      throw new Error(`GraphQL errors: ${JSON.stringify(data.errors)}`);
    }

    // Revalidate vaccinations data
    revalidateTag(`vaccinations-${dogId}`);
    revalidatePath('/vaccinations');
    revalidatePath('/recent-activity');
    
    return true;
  } catch (error) {
    console.error('Error deleting vaccination:', error);
    throw error;
  }
}
