import { GraphQLClient, gql } from 'graphql-request';

const BACKEND_URL = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3456/graphql';

const client = new GraphQLClient(BACKEND_URL);

const introspectionQuery = gql`
  {
    __schema {
      mutationType {
        fields {
          name
          args {
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
    }
  }
`;

client.request(introspectionQuery)
  .then(data => {
    const mutations = data.__schema.mutationType.fields;
    const taskMutations = mutations.filter(m => m.name.toLowerCase().includes('task'));
    
    console.log('\n🔍 Task-related mutations found:');
    console.log('='.repeat(50));
    
    if (taskMutations.length === 0) {
      console.log('❌ No task mutations found!');
    } else {
      taskMutations.forEach(mutation => {
        console.log(`\n📝 Mutation: ${mutation.name}`);
        console.log('   Arguments:');
        mutation.args.forEach(arg => {
          const typeName = arg.type.name || arg.type.ofType?.name || 'Unknown';
          console.log(`     - ${arg.name}: ${typeName}`);
        });
      });
    }
    
    console.log('\n' + '='.repeat(50));
  })
  .catch(error => {
    console.error('❌ Error checking schema:', error.message);
    console.error('Backend URL:', BACKEND_URL);
  });
