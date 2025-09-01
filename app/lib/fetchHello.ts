import { getGraphQLClient } from './graphql-client';

export async function fetchHello() {
  const client = getGraphQLClient();
  const query = `
    query {
      hello
    }
  `;
  return client.request<{ hello: string }>(query);
}