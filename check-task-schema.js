import { GraphQLClient, gql } from 'graphql-request';

const BACKEND_URL = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3456/graphql';

const client = new GraphQLClient(BACKEND_URL);

const introspectionQuery = gql`
  {
    __type(name: "EditTaskDto") {
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
    deleteTaskType: __type(name: "DeleteTaskByIdDto") {
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
  }
`;

client.request(introspectionQuery)
  .then(data => {
    console.log('\n📋 EditTaskDto Schema:');
    console.log('='.repeat(60));
    if (data.__type) {
      data.__type.inputFields.forEach(field => {
        const typeName = field.type.name || field.type.ofType?.name || 'Unknown';
        const required = field.type.kind === 'NON_NULL' ? ' (required)' : ' (optional)';
        console.log(`  ${field.name}: ${typeName}${required}`);
      });
    }
    
    console.log('\n🗑️  DeleteTaskByIdDto Schema:');
    console.log('='.repeat(60));
    if (data.deleteTaskType) {
      data.deleteTaskType.inputFields.forEach(field => {
        const typeName = field.type.name || field.type.ofType?.name || 'Unknown';
        const required = field.type.kind === 'NON_NULL' ? ' (required)' : ' (optional)';
        console.log(`  ${field.name}: ${typeName}${required}`);
      });
    }
    
    console.log('\n' + '='.repeat(60) + '\n');
  })
  .catch(error => {
    console.error('❌ Error checking schema:', error.message);
  });
