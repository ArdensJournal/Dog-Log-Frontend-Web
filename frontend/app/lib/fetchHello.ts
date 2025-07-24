import { client } from './graphql-client';

export async function fetchHello() {
  const query = `
    query {
      hello
    }
  `;
  return client.request<{ hello: string }>(query);
}