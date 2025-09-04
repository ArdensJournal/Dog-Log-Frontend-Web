// Check createTask mutation details
const BACKEND_URL = 'http://localhost:3456/graphql';

async function testTaskCompletion() {
  try {
    // Check what fields createTask accepts
    const introspectionQuery = `
      query {
        __schema {
          mutationType {
            fields(includeDeprecated: true) {
              name
              args {
                name
                type {
                  name
                  kind
                  ofType {
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
      }
    `;

    const response = await fetch(BACKEND_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: introspectionQuery }),
    });

    const data = await response.json();
    const createTaskMutation = data.data.__schema.mutationType.fields.find(f => f.name === 'createTask');
    
    console.log('📝 createTask mutation details:');
    console.log(JSON.stringify(createTaskMutation, null, 2));

    // Also check if there's an input type that shows the fields
    const inputTypes = data.data.__schema.types?.filter(t => t.name?.includes('CreateTaskDto')) || [];
    console.log('\n📝 CreateTaskDto input types:');
    inputTypes.forEach(type => {
      console.log(JSON.stringify(type, null, 2));
    });

  } catch (error) {
    console.error('Error:', error);
  }
}

testTaskCompletion();
