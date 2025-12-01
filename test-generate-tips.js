import fetch from 'node-fetch';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3456/graphql';
const DOG_ID = '68e2cd8173c7c77dbe517ccc'; // From your error
const TOKEN = process.env.TOKEN; // You need to provide this

async function testGenerateTips() {
  console.log('🧪 Testing createGeminiTip mutation...\n');
  console.log('Backend URL:', BACKEND_URL);
  console.log('Dog ID:', DOG_ID);
  console.log('Has token:', !!TOKEN);
  
  if (!TOKEN) {
    console.log('\n❌ No token provided.');
    console.log('Usage: TOKEN="your-token-here" node test-generate-tips.js');
    console.log('Get token from: Browser DevTools > Application > Cookies > token\n');
    return;
  }

  const mutation = `
    mutation CreateGeminiTip($createTipDto: GeminiTipDto!) {
      createGeminiTip(createTipDto: $createTipDto)
    }
  `;

  const variables = {
    createTipDto: {
      dogId: DOG_ID,
      language: 'HEBREW',
    },
  };

  console.log('\n📤 Sending mutation:');
  console.log('Variables:', JSON.stringify(variables, null, 2));

  try {
    const response = await fetch(BACKEND_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${TOKEN}`,
      },
      body: JSON.stringify({ query: mutation, variables }),
    });

    const data = await response.json();

    console.log('\n📥 Response status:', response.status);
    console.log('Response:', JSON.stringify(data, null, 2));

    if (data.errors) {
      console.log('\n❌ GraphQL Errors:');
      data.errors.forEach((error, index) => {
        console.log(`\nError ${index + 1}:`);
        console.log('  Message:', error.message);
        console.log('  Extensions:', JSON.stringify(error.extensions, null, 2));
      });
    } else if (data.data) {
      console.log('\n✅ Success!');
      console.log('Result:', data.data.createGeminiTip);
    }
  } catch (error) {
    console.error('\n❌ Request failed:', error.message);
  }
}

testGenerateTips();
