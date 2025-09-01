import { getGraphQLClient } from './graphql-client';
// DEBUG: Log endpoint
const client = getGraphQLClient();
// @ts-ignore
console.log('DEBUG: GraphQL endpoint', client?.url || client?.options?.url || 'unknown');

export type Vaccine = {
  _id: string;
  name: string;
  type: string;
  isMandatory: boolean;
  recommendedAge: { unit: string; value: number };
  recommendedFrequency: { unit: string; value: number };
};

export async function fetchVaccines() {
  const query = `
    query FindAllVaccines {
      findAllVaccines {
        _id
        name
        type
        isMandatory
        recommendedAge { unit value }
        recommendedFrequency { unit value }
      }
    }
  `;
  const res = await client.request<{ findAllVaccines: Vaccine[] }>(query);
  // DEBUG: Log result
  console.log('DEBUG: fetchVaccines result', res);
  return res.findAllVaccines;
}
