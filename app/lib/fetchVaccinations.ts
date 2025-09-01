import { getGraphQLClient } from './graphql-client';

export type VaccinationRecord = {
  _id: string;
  dog: string;
  vaccine: string;
  date: string;
  vet?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
};

export async function fetchVaccinations(dogId: string) {
  const query = `
    query FindAllVaccineRecordsByDog($dogId: ID!) {
      vaccinationRecords(dog: $dogId) {
      _id
      date
      note
      createdAt
      updatedAt
      vaccine
      validFor { unit value }
      }
    }
  `;
    const client = getGraphQLClient();
    return client.request(query, { dogId });
}
