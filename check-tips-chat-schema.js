import fetch from 'node-fetch';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3456/graphql';

const introspectionQuery = `
  query IntrospectionQuery {
    __schema {
      queryType {
        fields {
          name
          description
          args {
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
      mutationType {
        fields {
          name
          description
          args {
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
  }
`;

async function checkSchema() {
  try {
    console.log('🔍 Checking GraphQL schema for tips and chat operations...\n');
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

    console.log('\n📋 QUERIES related to tips/chat:');
    const queries = data.data.__schema.queryType.fields;
    const tipQueries = queries.filter(q => 
      q.name.toLowerCase().includes('tip') || 
      q.name.toLowerCase().includes('chat') ||
      q.name.toLowerCase().includes('gemini')
    );
    
    tipQueries.forEach(query => {
      console.log(`\n✅ ${query.name}`);
      if (query.description) console.log(`   Description: ${query.description}`);
      console.log('   Arguments:');
      query.args.forEach(arg => {
        const typeName = arg.type.ofType?.name || arg.type.name;
        console.log(`     - ${arg.name}: ${typeName}`);
      });
    });

    console.log('\n\n🔧 MUTATIONS related to tips/chat:');
    const mutations = data.data.__schema.mutationType.fields;
    const tipMutations = mutations.filter(m => 
      m.name.toLowerCase().includes('tip') || 
      m.name.toLowerCase().includes('chat') ||
      m.name.toLowerCase().includes('gemini')
    );
    
    tipMutations.forEach(mutation => {
      console.log(`\n✅ ${mutation.name}`);
      if (mutation.description) console.log(`   Description: ${mutation.description}`);
      console.log('   Arguments:');
      mutation.args.forEach(arg => {
        const typeName = arg.type.ofType?.name || arg.type.name;
        console.log(`     - ${arg.name}: ${typeName}`);
      });
    });

    console.log('\n\n✨ Done!');
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkSchema();
