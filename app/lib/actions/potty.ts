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

// Server action to get potty records for a dog
export async function getPottyRecords(dogId: string) {
  try {
    const token = await getAuthToken();
    
    if (!token) {
      return [];
    }

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

    const response = await fetch(BACKEND_URL!, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        query,
        variables: { 
          findByDogIdDto: {
            dogId: dogId
          }
        }
      }),
      next: { tags: [`potty-${dogId}`] } // Cache tag for specific dog's potty records
    });

    if (!response.ok) {
      console.error('Failed to fetch potty records:', response.status);
      return [];
    }

    const data = await response.json();
    
    if (data.errors) {
      console.error('GraphQL errors:', data.errors);
      return [];
    }

    return data.data.findPottyByDogId || [];
  } catch (error) {
    console.error('Error fetching potty records:', error);
    return [];
  }
}

// Server action to create a potty record
export async function createPottyRecord(pottyData: {
  dogId: string;
  type: 'pee' | 'poop' | 'both';
  environment?: string;
  notes?: string;
  date?: string;
  healthFlags?: string[];
  coordinates?: { latitude: number; longitude: number };
}) {
  try {
    const token = await getAuthToken();
    
    if (!token) {
      throw new Error('Authentication required');
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

    const response = await fetch(BACKEND_URL!, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        query: mutation,
        variables: { 
          createPottyDto: {
            dog: pottyData.dogId,
            date: pottyData.date || new Date().toISOString(),
            type: pottyData.type,
            environment: pottyData.environment || null,
            healthFlags: pottyData.healthFlags || [],
            note: pottyData.notes || null,
            coordinates: pottyData.coordinates || null
          }
        }
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to create potty record: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.errors) {
      throw new Error(`GraphQL errors: ${JSON.stringify(data.errors)}`);
    }

    // Revalidate potty records data
    revalidateTag(`potty-${pottyData.dogId}`);
    revalidatePath('/needs');
    revalidatePath('/recent-activity');
    
    return data.data.createPotty;
  } catch (error) {
    console.error('Error creating potty record:', error);
    throw error;
  }
}

// Server action to update a potty record
export async function updatePottyRecord(recordId: string, updates: any) {
  try {
    const token = await getAuthToken();
    
    if (!token) {
      throw new Error('Authentication required');
    }

    const mutation = `
      mutation UpdatePottyRecord($id: ID!, $input: UpdatePottyRecordInput!) {
        updatePottyRecord(id: $id, input: $input) {
          _id
          dogId
          type
          timestamp
          location
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
        variables: { id: recordId, input: updates }
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to update potty record: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.errors) {
      throw new Error(`GraphQL errors: ${JSON.stringify(data.errors)}`);
    }

    const record = data.data.updatePottyRecord;

    // Revalidate potty records data
    revalidateTag(`potty-${record.dogId}`);
    revalidatePath('/needs');
    revalidatePath('/recent-activity');
    
    return record;
  } catch (error) {
    console.error('Error updating potty record:', error);
    throw error;
  }
}

// Server action to delete a potty record
export async function deletePottyRecord(recordId: string, dogId: string) {
  try {
    const token = await getAuthToken();
    
    if (!token) {
      throw new Error('Authentication required');
    }

    const mutation = `
      mutation DeletePottyRecord($id: ID!) {
        deletePottyRecord(id: $id)
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
        variables: { id: recordId }
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to delete potty record: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.errors) {
      throw new Error(`GraphQL errors: ${JSON.stringify(data.errors)}`);
    }

    // Revalidate potty records data
    revalidateTag(`potty-${dogId}`);
    revalidatePath('/needs');
    revalidatePath('/recent-activity');
    
    return true;
  } catch (error) {
    console.error('Error deleting potty record:', error);
    throw error;
  }
}
