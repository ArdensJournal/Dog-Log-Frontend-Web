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

// Server action to get all dogs for the current user
export async function getUserDogs() {
  try {
    const token = await getAuthToken();
    
    if (!token) {
      return [];
    }

    const query = `
      query GetUserDogs {
        userDogs {
          _id
          name
          breeds
          birthday
          gender
          imageUrl
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
      next: { tags: ['dogs'] } // Cache tag for revalidation
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Failed to fetch dogs:', response.status, errorText);
      console.error('Request URL:', BACKEND_URL);
      console.error('Request headers:', {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token?.substring(0, 10)}...`,
      });
      console.error('Request body:', JSON.stringify({ query }));
      return [];
    }

    const data = await response.json();
    
    if (data.errors) {
      console.error('GraphQL errors:', data.errors);
      return [];
    }

    return data.data.userDogs || [];
  } catch (error) {
    console.error('Error fetching dogs:', error);
    return [];
  }
}

// Server action to create a new dog
export async function createDog(dogData: {
  name: string;
  breeds: string[];
  birthday: string;
  gender?: string;
  imageUrl?: string;
}) {
  try {
    const token = await getAuthToken();
    
    if (!token) {
      throw new Error('Authentication required');
    }

    const mutation = `
      mutation CreateDog($input: CreateDogInput!) {
        createDog(input: $input) {
          _id
          name
          breeds
          birthday
          gender
          imageUrl
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
        variables: { input: dogData }
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to create dog: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.errors) {
      throw new Error(`GraphQL errors: ${JSON.stringify(data.errors)}`);
    }

    // Revalidate dogs data
    revalidateTag('dogs');
    revalidatePath('/dogs');
    
    return data.data.createDog;
  } catch (error) {
    console.error('Error creating dog:', error);
    throw error;
  }
}

// Server action to update a dog
export async function updateDog(dogId: string, updates: any) {
  try {
    const token = await getAuthToken();
    
    if (!token) {
      throw new Error('Authentication required');
    }

    const mutation = `
      mutation UpdateDog($id: ID!, $input: UpdateDogInput!) {
        updateDog(id: $id, input: $input) {
          _id
          name
          breeds
          birthday
          gender
          imageUrl
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
        variables: { id: dogId, input: updates }
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to update dog: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.errors) {
      throw new Error(`GraphQL errors: ${JSON.stringify(data.errors)}`);
    }

    // Revalidate dogs data
    revalidateTag('dogs');
    revalidatePath('/dogs');
    revalidatePath(`/dogs/${dogId}`);
    
    return data.data.updateDog;
  } catch (error) {
    console.error('Error updating dog:', error);
    throw error;
  }
}

// Server action to delete a dog
export async function deleteDog(dogId: string) {
  try {
    const token = await getAuthToken();
    
    if (!token) {
      throw new Error('Authentication required');
    }

    const mutation = `
      mutation DeleteDog($findByDogIdDto: FindByDogIdDto!) {
        deleteDog(findByDogIdDto: $findByDogIdDto) {
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
      body: JSON.stringify({
        query: mutation,
        variables: { 
          findByDogIdDto: { dogId }
        }
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to delete dog: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.errors) {
      throw new Error(`GraphQL errors: ${JSON.stringify(data.errors)}`);
    }

    // Revalidate dogs data
    revalidateTag('dogs');
    revalidatePath('/dogs');
    
    return true;
  } catch (error) {
    console.error('Error deleting dog:', error);
    throw error;
  }
}
