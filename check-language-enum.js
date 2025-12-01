import fetch from 'node-fetch';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3456/graphql';

const introspectionQuery = `
  query IntrospectionQuery {
    __type(name: "Language") {
      name
      kind
      enumValues {
        name
        description
      }
    }
  }
`;

async function checkSchema() {
  try {
    console.log('🔍 Checking Language enum values...\n');
    console.log('Backend URL:', BACKEND_URL);
    
    const response = await fetch(BACKEND_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: introspectionQuery }),
    });

    const data = await response.json();
    
    if (data.errors) {
      console.error('❌ GraphQL errors:', data.errors);
      return;
    }

    const languageEnum = data.data.__type;
    
    console.log('\n📋 Language Enum Values:\n');
    
    languageEnum.enumValues.forEach(value => {
      console.log(`✅ ${value.name}`);
      if (value.description) {
        console.log(`   Description: ${value.description}`);
      }
    });

    console.log('\n✨ Done!');
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkSchema();
