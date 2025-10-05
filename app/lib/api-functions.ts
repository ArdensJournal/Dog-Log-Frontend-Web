// Example: How to update your fetchDogs function to use the new API client

import { apiClient, type DogsResponse } from './api-client';

export async function fetchDogs(): Promise<DogsResponse> {
  try {
    // ✅ NEW: Call your Next.js API instead of external backend directly
    const response = await apiClient.getDogs();
    return response;
  } catch (error) {
    console.error('Error fetching dogs:', error);
    throw error;
  }
}

// Example: How to add a new dog
export async function addDog(dogData: {
  name: string;
  breeds: string[];
  birthday: string;
  gender: string;
}) {
  try {
    const response = await apiClient.addDog(dogData);
    return response;
  } catch (error) {
    console.error('Error adding dog:', error);
    throw error;
  }
}

// Example: How to update a dog with file
export async function updateDogWithFile(dogId: string, formData: FormData) {
  try {
    const response = await apiClient.updateDogWithFile(dogId, formData);
    return response;
  } catch (error) {
    console.error('Error updating dog with file:', error);
    throw error;
  }
}

// Example: Authentication functions
export async function signIn(email: string, password: string) {
  try {
    const response = await apiClient.signin(email, password);
    return response;
  } catch (error) {
    console.error('Error signing in:', error);
    throw error;
  }
}

export async function signUp(
  name: string, 
  email: string, 
  password: string, 
  acceptedTerms: boolean
) {
  try {
    const response = await apiClient.signup(name, email, password, acceptedTerms);
    return response;
  } catch (error) {
    console.error('Error signing up:', error);
    throw error;
  }
}

export async function signOut() {
  try {
    const response = await apiClient.signout();
    return response;
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
}

export async function getCurrentUser() {
  try {
    const response = await apiClient.getCurrentUser();
    return response;
  } catch (error) {
    console.error('Error getting current user:', error);
    throw error;
  }
}
