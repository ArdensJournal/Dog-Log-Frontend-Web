import { GraphQLClient, gql } from 'graphql-request';

const BACKEND_URL = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3456/graphql';

const client = new GraphQLClient(BACKEND_URL);

const introspectionQuery = gql`
  {
    createDogInput: __type(name: "CreateDogDto") {
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
    editDogInput: __type(name: "EditDogDto") {
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
    dogModel: __type(name: "DogModel") {
      name
      kind
      fields {
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
`;

client.request(introspectionQuery)
  .then(data => {
    console.log('\n📝 CreateDogDto Schema (for adding dogs):');
    console.log('='.repeat(70));
    if (data.createDogInput) {
      data.createDogInput.inputFields.forEach(field => {
        const typeName = field.type.name || field.type.ofType?.name || 'Unknown';
        const required = field.type.kind === 'NON_NULL' ? ' (required)' : ' (optional)';
        console.log(`  ${field.name}: ${typeName}${required}`);
      });
    }
    
    console.log('\n✏️  EditDogDto Schema (for editing dogs):');
    console.log('='.repeat(70));
    if (data.editDogInput) {
      data.editDogInput.inputFields.forEach(field => {
        const typeName = field.type.name || field.type.ofType?.name || 'Unknown';
        const required = field.type.kind === 'NON_NULL' ? ' (required)' : ' (optional)';
        console.log(`  ${field.name}: ${typeName}${required}`);
      });
    }
    
    console.log('\n🐕 DogModel Schema (what dogs return):');
    console.log('='.repeat(70));
    if (data.dogModel) {
      data.dogModel.fields.forEach(field => {
        const typeName = field.type.name || field.type.ofType?.name || 'Unknown';
        console.log(`  ${field.name}: ${typeName}`);
      });
    }
    
    console.log('\n' + '='.repeat(70));
    
    // Check specifically for location fields
    const createHasLocation = data.createDogInput?.inputFields?.some(f => 
      f.name.toLowerCase().includes('location') || f.name.toLowerCase().includes('address')
    );
    const editHasLocation = data.editDogInput?.inputFields?.some(f => 
      f.name.toLowerCase().includes('location') || f.name.toLowerCase().includes('address')
    );
    const modelHasLocation = data.dogModel?.fields?.some(f => 
      f.name.toLowerCase().includes('location') || f.name.toLowerCase().includes('address')
    );
    
    console.log('\n🔍 Location Field Detection:');
    console.log('  CreateDogDto has location:', createHasLocation ? '✅ YES' : '❌ NO');
    console.log('  EditDogDto has location:', editHasLocation ? '✅ YES' : '❌ NO');
    console.log('  DogModel has location:', modelHasLocation ? '✅ YES' : '❌ NO');
    console.log('');
  })
  .catch(error => {
    console.error('❌ Error checking schema:', error.message);
  });
