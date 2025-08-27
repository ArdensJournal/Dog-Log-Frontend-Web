// Get detailed DTO structures for dogs
const BACKEND_URL = 'http://localhost:3456/graphql';

async function getDogDTOStructures() {
  const introspectionQuery = `
    query GetDogDTOs {
      __schema {
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
          inputFields {
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
    
    // Find dog-related DTOs
    const types = data.data.__schema.types;
    
    const createDogDto = types.find(t => t.name === 'CreateDogDto');
    const updateDogDto = types.find(t => t.name === 'UpdateDogDto');
    const findByDogIdDto = types.find(t => t.name === 'FindByDogIdDto');
    const dogModel = types.find(t => t.name === 'DogModel');
    
    console.log('🐕 CreateDogDto fields:', JSON.stringify(createDogDto?.inputFields, null, 2));
    console.log('\n🔄 UpdateDogDto fields:', JSON.stringify(updateDogDto?.inputFields, null, 2));
    console.log('\n🔍 FindByDogIdDto fields:', JSON.stringify(findByDogIdDto?.inputFields, null, 2));
    console.log('\n🐶 DogModel fields:', JSON.stringify(dogModel?.fields, null, 2));

  } catch (error) {
    console.error('💥 Error:', error.message);
  }
}

getDogDTOStructures();
