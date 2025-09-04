// Check all available mutations
const BACKEND_URL = 'http://localhost:3456/graphql';

async function checkAllMutations() {
  try {
    const introspectionQuery = `
      query IntrospectionQuery {
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

    const response = await fetch(BACKEND_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: introspectionQuery }),
    });

    const data = await response.json();
    const mutations = data.data.__schema.mutationType.fields;
    
    console.log('🔧 ALL available mutations:');
    mutations.forEach(m => {
      console.log(`  - ${m.name}: [${m.args.map(arg => `${arg.name}: ${arg.type.name || arg.type.ofType?.name || 'Unknown'}`).join(', ')}]`);
    });
  } catch (error) {
    console.error('Error:', error);
  }
}

checkAllMutations();
