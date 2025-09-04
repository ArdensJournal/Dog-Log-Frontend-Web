// Debug script to check available task mutations
const BACKEND_URL = 'http://localhost:3456/graphql';

async function checkTaskMutations() {
  console.log('🔍 Checking available task mutations...');
  
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
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: introspectionQuery }),
    });

    if (!response.ok) {
      console.error('❌ Response not ok:', response.status);
      return;
    }

    const data = await response.json();
    
    if (data.errors) {
      console.error('❌ GraphQL errors:', data.errors);
      return;
    }

    // Find task-related mutations  
    const mutations = data.data.__schema.mutationType.fields;
    const taskMutations = mutations.filter(m => m.name.toLowerCase().includes('task'));
    
    console.log('\n🔧 Available task mutations:');
    taskMutations.forEach(m => {
      console.log(`  - ${m.name}: [${m.args.map(arg => `${arg.name}: ${arg.type.name || arg.type.ofType?.name || 'Unknown'}`).join(', ')}]`);
    });

    console.log('\n📋 All mutations containing "update" or "delete":');
    const updateDeleteMutations = mutations.filter(m => 
      m.name.toLowerCase().includes('update') || 
      m.name.toLowerCase().includes('delete') ||
      m.name.toLowerCase().includes('remove')
    );
    updateDeleteMutations.forEach(m => {
      console.log(`  - ${m.name}: [${m.args.map(arg => `${arg.name}: ${arg.type.name || arg.type.ofType?.name || 'Unknown'}`).join(', ')}]`);
    });

  } catch (error) {
    console.error('❌ Error checking schema:', error);
  }
}

checkTaskMutations();
