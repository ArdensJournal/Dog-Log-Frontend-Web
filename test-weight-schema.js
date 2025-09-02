const BACKEND_URL = 'http://localhost:3456/graphql';

async function testWeightOperations() {
  const introspectionQuery = `
    query {
      __schema {
        queryType {
          fields {
            name
            args {
              name
              type {
                name
                ofType { name }
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
                ofType { name }
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
      body: JSON.stringify({ query: introspectionQuery }),
    });

    if (!response.ok) {
      console.log('❌ Response status:', response.status);
      console.log('Response:', await response.text());
      return;
    }

    const result = await response.json();
    
    if (result.errors) {
      console.log('❌ GraphQL errors:', result.errors);
      return;
    }

    const queries = result.data.__schema.queryType.fields;
    const mutations = result.data.__schema.mutationType.fields;
    
    console.log('🔍 Weight-related QUERIES:');
    queries.filter(f => f.name.toLowerCase().includes('weight')).forEach(f => {
      console.log(`  - ${f.name}(${f.args?.map(a => `${a.name}: ${a.type.name || a.type.ofType?.name}`).join(', ')})`);
    });
    
    console.log('\n🔧 Weight-related MUTATIONS:');
    mutations.filter(f => f.name.toLowerCase().includes('weight')).forEach(f => {
      console.log(`  - ${f.name}(${f.args?.map(a => `${a.name}: ${a.type.name || a.type.ofType?.name}`).join(', ')})`);
    });
    
  } catch (error) {
    console.error('💥 Network error:', error.message);
  }
}

testWeightOperations();
