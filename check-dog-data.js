import fetch from 'node-fetch';
import { readFileSync } from 'fs';
import { parse } from 'cookie';

// Read cookies from browser or use a token directly
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3456/graphql';
const DOG_ID = '68e2cd8173c7c77dbe517ccc'; // The dog ID from the error

async function checkDogData() {
  try {
    console.log('🔍 Checking dog data...\n');
    console.log('Backend URL:', BACKEND_URL);
    console.log('Dog ID:', DOG_ID);
    
    // You'll need to provide your auth token
    console.log('\n⚠️  Please run this with your auth token:');
    console.log('   Set TOKEN environment variable or modify this script\n');
    
    const token = process.env.TOKEN;
    
    if (!token) {
      console.log('❌ No token provided. Cannot fetch dog data.');
      console.log('   Get your token from browser DevTools > Application > Cookies > token');
      return;
    }
    
    const query = `
      query GetUserDogs {
        userDogs {
          _id
          name
          breeds
          birthday
          gender
          imageUrl
          weight {
            _id
            date
            weight
          }
          activities {
            _id
            date
            description
          }
          vaccinations {
            _id
            date
            vaccine {
              name
            }
          }
        }
      }
    `;

    const response = await fetch(BACKEND_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ query }),
    });

    const data = await response.json();
    
    if (data.errors) {
      console.error('❌ GraphQL errors:', data.errors);
      return;
    }

    const dogs = data.data.userDogs;
    const targetDog = dogs.find(d => d._id === DOG_ID);
    
    if (!targetDog) {
      console.log('❌ Dog not found!');
      console.log('\nAvailable dogs:');
      dogs.forEach(dog => {
        console.log(`   - ${dog.name} (${dog._id})`);
      });
      return;
    }
    
    console.log('\n✅ Found dog:', targetDog.name);
    console.log('\n📋 Dog Details:');
    console.log(`   Name: ${targetDog.name}`);
    console.log(`   Breeds: ${targetDog.breeds?.join(', ') || 'None'}`);
    console.log(`   Birthday: ${targetDog.birthday || 'Not set'}`);
    console.log(`   Gender: ${targetDog.gender || 'Not set'}`);
    console.log(`   Weight entries: ${targetDog.weight?.length || 0}`);
    console.log(`   Activities: ${targetDog.activities?.length || 0}`);
    console.log(`   Vaccinations: ${targetDog.vaccinations?.length || 0}`);
    
    if (targetDog.weight?.length > 0) {
      console.log('\n   Latest weight:', targetDog.weight[0].weight, 'kg');
    }
    
    console.log('\n💡 Analysis:');
    const hasEnoughData = 
      targetDog.breeds?.length > 0 &&
      targetDog.birthday &&
      targetDog.weight?.length > 0;
      
    if (hasEnoughData) {
      console.log('   ✅ Dog has sufficient data for AI tips');
    } else {
      console.log('   ⚠️  Dog might need more data:');
      if (!targetDog.breeds?.length) console.log('      - Missing breed information');
      if (!targetDog.birthday) console.log('      - Missing birthday');
      if (!targetDog.weight?.length) console.log('      - Missing weight data');
    }

    console.log('\n✨ Done!');
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkDogData();
