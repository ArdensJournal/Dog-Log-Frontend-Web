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
            enumValues {
              name
              description
            }
          }
        }
      }
    }
  }
`;

async function checkSchema() {
  try {
    console.log('🔍 Checking GeminiTipDto input type...\n');
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
      console.log(`✅ ${field.name}`);
      const type = field.type.ofType || field.type;
      console.log(`   Type: ${type.name} (${type.kind})`);
      
      if (type.ofType?.enumValues) {
        console.log('   Enum values:');
        type.ofType.enumValues.forEach(enumValue => {
          console.log(`     - ${enumValue.name}`);
        });
      }
      console.log('');
    });

    console.log('\n✨ Done!');
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkSchema();
