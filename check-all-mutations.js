import fetch from 'node-fetch';

const BACKEND_URL = 'http://localhost:3456/graphql';

const fullSchemaQuery = `
  query {
    __type(name: "Mutation") {
      fields {
        name
        description
        args {
          name
          description
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

async function checkFullMutations() {
  try {
    console.log('🔍 Fetching all mutations from schema...\n');
    
    const response = await fetch(BACKEND_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: fullSchemaQuery }),
    });

    const data = await response.json();
    
    if (data.errors) {
      console.error('❌ GraphQL errors:', data.errors);
      return;
    }

    const mutations = data.data.__type.fields;
    
    console.log('🔧 ALL MUTATIONS:\n');
    mutations.forEach(mutation => {
      console.log(`✅ ${mutation.name}`);
      if (mutation.description) {
        console.log(`   Description: ${mutation.description}`);
      }
      if (mutation.args && mutation.args.length > 0) {
        console.log('   Arguments:');
        mutation.args.forEach(arg => {
          const typeName = arg.type.ofType?.name || arg.type.name;
          console.log(`     - ${arg.name}: ${typeName}${arg.description ? ` (${arg.description})` : ''}`);
        });
      }
      console.log('');
    });

    // Filter for chat/gemini/tip related
    console.log('\n\n🎯 CHAT/TIP/GEMINI RELATED MUTATIONS:\n');
    const relevantMutations = mutations.filter(m => 
      m.name.toLowerCase().includes('tip') || 
      m.name.toLowerCase().includes('chat') ||
      m.name.toLowerCase().includes('gemini') ||
      m.name.toLowerCase().includes('ask') ||
      m.name.toLowerCase().includes('question')
    );
    
    if (relevantMutations.length === 0) {
      console.log('❌ No chat/question mutations found');
      console.log('   Available: createGeminiTip, findTipsByDogId');
    } else {
      relevantMutations.forEach(mutation => {
        console.log(`✅ ${mutation.name}`);
        if (mutation.description) {
          console.log(`   Description: ${mutation.description}`);
        }
        console.log('   Arguments:');
        mutation.args.forEach(arg => {
          const typeName = arg.type.ofType?.name || arg.type.name;
          console.log(`     - ${arg.name}: ${typeName}`);
        });
        console.log('');
      });
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkFullMutations();
