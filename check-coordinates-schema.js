import { GraphQLClient, gql } from 'graphql-request';

const BACKEND_URL = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3456/graphql';

const client = new GraphQLClient(BACKEND_URL);

const introspectionQuery = gql`
  {
    coordinatesInput: __type(name: "CoordinatesInput") {
      name
      kind
      inputFields {
        name
        type {
          name
          kind
          ofType {
            name
            kind
          }
        }
      }
    }
    coordinates: __type(name: "Coordinates") {
      name
      kind
      fields {
        name
        type {
          name
          kind
          ofType {
            name
            kind
          }
        }
      }
    }
  }
`;

client.request(introspectionQuery)
  .then(data => {
    console.log('\n📍 CoordinatesInput Schema (for input):');
    console.log('='.repeat(70));
    if (data.coordinatesInput) {
      data.coordinatesInput.inputFields.forEach(field => {
        const typeName = field.type.name || field.type.ofType?.name || 'Unknown';
        const required = field.type.kind === 'NON_NULL' ? ' (required)' : ' (optional)';
        console.log(`  ${field.name}: ${typeName}${required}`);
      });
    }
    
    console.log('\n📍 Coordinates Schema (for output):');
    console.log('='.repeat(70));
    if (data.coordinates) {
      data.coordinates.fields.forEach(field => {
        const typeName = field.type.name || field.type.ofType?.name || 'Unknown';
        console.log(`  ${field.name}: ${typeName}`);
      });
    }
    
    console.log('\n' + '='.repeat(70) + '\n');
  })
  .catch(error => {
    console.error('❌ Error checking schema:', error.message);
  });
