import { GraphQLClient } from 'graphql-request';

const endpoint = process.env.NEXT_PUBLIC_BACKEND_URL;

if (!endpoint) {
  throw new Error('NEXT_PUBLIC_BACKEND_URL is not defined in the environment variables.');
}

export const client = new GraphQLClient(endpoint as string);