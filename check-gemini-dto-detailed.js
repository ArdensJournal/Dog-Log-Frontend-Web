import fetch from 'node-fetch';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3456/graphql';

const introspectionQuery = `
  query IntrospectionQuery {
    __type(name: "GeminiTipDto") {
      name
      kind
      inputFields {
        name
        description
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
`;

async function checkSchema() {
  try {
    console.log('🔍 Checking GeminiTipDto detailed structure...\n');
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

    const tipDto = data.data.__type;
    
    console.log('\n📋 GeminiTipDto structure:');
    console.log(`   Type: ${tipDto.kind}\n`);
    
    tipDto.inputFields.forEach(field => {
      const isRequired = field.type.kind === 'NON_NULL';
      const actualType = field.type.ofType || field.type;
      const innerType = actualType.ofType || actualType;
      
      console.log(`${isRequired ? '🔴 REQUIRED' : '⚪ OPTIONAL'} ${field.name}`);
      console.log(`   Type: ${actualType.name || innerType.name} (${actualType.kind})`);
      if (isRequired) {
        console.log(`   ⚠️  This field MUST be provided!`);
      }
      console.log('');
    });

    console.log('\n✨ Done!');
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkSchema();
