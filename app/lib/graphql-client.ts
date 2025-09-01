import { GraphQLClient } from 'graphql-request';

const endpoint = process.env.NEXT_PUBLIC_BACKEND_URL;

if (!endpoint) {
  throw new Error('NEXT_PUBLIC_BACKEND_URL is not defined in the environment variables.');
}

// Create a function to get the token from localStorage (browser only)
function getToken() {
  if (typeof window !== 'undefined') {
    // Check multiple possible token storage keys
    const tokenKeys = ['token', 'accessToken', 'authToken', 'jwt', 'access_token'];
    
    for (const key of tokenKeys) {
      const token = localStorage.getItem(key);
      if (token) {
        console.log(`Found token under key: ${key}`, token.substring(0, 20) + '...');
        return token;
      }
    }
    
    // Also check cookies
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
      const [name, value] = cookie.trim().split('=');
      if (tokenKeys.includes(name) && value) {
        console.log(`Found token in cookie: ${name}`, value.substring(0, 20) + '...');
        return value;
      }
    }
    
    console.log('No token found in localStorage or cookies');
    console.log('Available localStorage keys:', Object.keys(localStorage));
    console.log('Available cookies:', document.cookie);
    return null;
  }
  return null;
}

// Export a function to get an authenticated GraphQL client
export function getGraphQLClient() {
  const token = getToken();
  return new GraphQLClient(endpoint as string, {
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
}