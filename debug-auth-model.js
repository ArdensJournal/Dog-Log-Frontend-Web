// Get the actual AuthModel structure
const BACKEND_URL = 'http://localhost:3456/graphql';

async function getAuthModelStructure() {
  const introspectionQuery = `
    query GetAuthModel {
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
    
    // Find AuthModel
    const authModel = data.data.__schema.types.find(t => t.name === 'AuthModel');
    console.log('🎯 AuthModel actual fields:', JSON.stringify(authModel?.fields, null, 2));
    
    // Also find UserModel
    const userModel = data.data.__schema.types.find(t => t.name === 'UserModel');
    console.log('👤 UserModel fields:', JSON.stringify(userModel?.fields, null, 2));

  } catch (error) {
    console.error('💥 Error:', error.message);
  }
}

getAuthModelStructure();
