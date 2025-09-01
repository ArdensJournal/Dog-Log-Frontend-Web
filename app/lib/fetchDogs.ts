import { apiClient } from './api-client';

export async function fetchDogs() {
  try {
    const result = await apiClient.getDogs();
    return result.data?.userDogs || [];
  } catch (error) {
    console.error('Error fetching dogs:', error);
    return [];
  }
}