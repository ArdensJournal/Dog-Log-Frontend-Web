// Check task-related GraphQL operations
const BACKEND_URL = 'http://localhost:3456/graphql';

async function inspectTaskOperations() {
  const introspectionQuery = `
    query GetTaskOperations {
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
        types {
          name
          kind
          fields {
            name
            type {
              name
              kind
              ofType {
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
    
    // Find task-related queries
    const queries = data.data.__schema.queryType.fields;
    const taskQueries = queries.filter(q => q.name.toLowerCase().includes('task'));
    
    console.log('📋 Available task queries:');
    taskQueries.forEach(q => {
      console.log(`  - ${q.name}:`, q.args.map(arg => `${arg.name}: ${arg.type.name || arg.type.ofType?.name}`));
    });

    // Find task-related mutations  
    const mutations = data.data.__schema.mutationType.fields;
    const taskMutations = mutations.filter(m => m.name.toLowerCase().includes('task'));
    
    console.log('\n🔧 Available task mutations:');
    taskMutations.forEach(m => {
      console.log(`  - ${m.name}:`, m.args.map(arg => `${arg.name}: ${arg.type.name || arg.type.ofType?.name}`));
    });

    // Find all available mutations
    console.log('\n🔧 ALL Available mutations:');
    mutations.forEach(m => {
      console.log(`  - ${m.name}:`, m.args.map(arg => `${arg.name}: ${arg.type.name || arg.type.ofType?.name}`));
    });

    // Find TaskModel structure
    const types = data.data.__schema.types || [];
    const taskModel = types.find(t => t.name === 'TaskModel');
    if (taskModel) {
      console.log('\n📋 TaskModel fields:', taskModel.fields?.map(f => `${f.name}: ${f.type.name || f.type.ofType?.name}`));
    }

    // Find CreateTaskDto structure
    const createTaskDto = types.find(t => t.name === 'CreateTaskDto');
    if (createTaskDto) {
      console.log('\n📝 CreateTaskDto fields:', createTaskDto.fields?.map(f => `${f.name}: ${f.type.name || f.type.ofType?.name}`));
    }

  } catch (error) {
    console.error('💥 Error:', error.message);
  }
}

inspectTaskOperations();
