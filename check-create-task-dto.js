// Check CreateTaskDto input fields
const BACKEND_URL = 'http://localhost:3456/graphql';

async function checkCreateTaskDto() {
  try {
    const introspectionQuery = `
      query {
        __schema {
          types {
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
      }
    `;

    const response = await fetch(BACKEND_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: introspectionQuery }),
    });

    const data = await response.json();
    const createTaskDto = data.data.__schema.types.find(t => t.name === 'CreateTaskDto');
    
    console.log('📝 CreateTaskDto input fields:');
    if (createTaskDto && createTaskDto.inputFields) {
      createTaskDto.inputFields.forEach(field => {
        const typeName = field.type.name || field.type.ofType?.name || 'Unknown';
        console.log(`  - ${field.name}: ${typeName}`);
      });
    } else {
      console.log('CreateTaskDto not found or has no input fields');
    }

  } catch (error) {
    console.error('Error:', error);
  }
}

checkCreateTaskDto();
