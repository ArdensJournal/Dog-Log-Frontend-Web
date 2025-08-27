// Check dog-related GraphQL operations
const BACKEND_URL = 'http://localhost:3456/graphql';

async function inspectDogOperations() {
  const introspectionQuery = `
    query GetDogOperations {
      __schema {
        queryType {
          fields {
            name
            args {
              name
              type {
                name
                kind
                ofType {
                  name
                }
              }
            }
            type {
              name
              fields {
                name
              }
            }
          }
        }
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
                }
              }
            }
            type {
              name
              fields {
                name
              }
            }
          }
        }
      }
    }
  `;

  try {
    const response = await fetch(BACKEND_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: introspectionQuery
      }),
    });

    const data = await response.json();
    
    // Find dog-related queries
    const queries = data.data.__schema.queryType.fields;
    const dogQueries = queries.filter(q => q.name.toLowerCase().includes('dog') || q.name === 'userDogs');
    
    console.log('🐕 Available dog queries:');
    dogQueries.forEach(q => {
      console.log(`  - ${q.name}:`, q.args.map(arg => `${arg.name}: ${arg.type.name || arg.type.ofType?.name}`));
    });

    // Find dog-related mutations  
    const mutations = data.data.__schema.mutationType.fields;
    const dogMutations = mutations.filter(m => m.name.toLowerCase().includes('dog'));
    
    console.log('\n🔧 Available dog mutations:');
    dogMutations.forEach(m => {
      console.log(`  - ${m.name}:`, m.args.map(arg => `${arg.name}: ${arg.type.name || arg.type.ofType?.name}`));
    });

    // Find DogModel structure
    const types = data.data.__schema.types || [];
    const dogModel = types.find(t => t.name === 'DogModel');
    if (dogModel) {
      console.log('\n🐶 DogModel fields:', dogModel.fields?.map(f => f.name));
    }

  } catch (error) {
    console.error('💥 Error:', error.message);
  }
}

inspectDogOperations();
