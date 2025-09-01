import { getGraphQLClient } from './graphql-client';

export async function addVaccination(input: any) {
  const mutation = `
    mutation CreateVaccineRecord($input: CreateVaccineRecordDto!) {
      createVaccineRecord(createVaccineRecordDto: $input) {
        _id
      }
    }
  `;
  const client = getGraphQLClient();
  return client.request(mutation, { createVaccineRecordDto: input });
}
