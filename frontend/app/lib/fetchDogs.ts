import { client } from './graphql-client';

export async function fetchDogs() {
  const query = `
    query {
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
  return client.request<{ userDogs: any[] }>(query);
}