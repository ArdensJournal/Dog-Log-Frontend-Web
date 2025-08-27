// Test the signin mutation directly with the backend
const BACKEND_URL = 'http://localhost:3456/graphql';

async function testSignIn() {
  console.log('🔍 Testing signInByCredentials mutation...');
  
  // First test if backend is responding at all
  try {
    console.log('📡 Testing basic connection...');
    const basicTest = await fetch('http://localhost:3456/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: '{ sayHello }' }),
    });
    
    console.log('✅ Backend is responding:', basicTest.status);
  } catch (error) {
    console.error('❌ Backend connection failed:', error.message);
    console.error('💡 Make sure your backend server is running on port 3456');
    return;
  }

  const mutation = `
    mutation SignInByCredentials($signInByCredentialsDto: SignInOrSignUpByCredentialsDto!) {
      signInByCredentials(signInByCredentialsDto: $signInByCredentialsDto) {
        token
        user {
          _id
          name
          email
        }
      }
    }
  `;

  // Test with dummy credentials to see the exact error
  try {
    const response = await fetch(BACKEND_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: mutation,
        variables: { 
          signInByCredentialsDto: { 
            email: "test@example.com", 
            password: "testpass123" 
          }
        }
      }),
    });

    console.log('📊 Response status:', response.status);
    const data = await response.json();
    
    console.log('📋 Full response:', JSON.stringify(data, null, 2));

    if (data.errors) {
      console.log('❌ GraphQL Errors:', data.errors);
      console.log('🔍 Error details:', data.errors[0]?.message);
    } else {
      console.log('✅ Mutation structure is correct!');
    }

  } catch (error) {
    console.error('💥 Network Error:', error.message);
    console.error('🔧 Full error:', error);
  }
}

testSignIn();
