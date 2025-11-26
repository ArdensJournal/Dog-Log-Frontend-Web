import { GraphQLClient, gql } from 'graphql-request';

const BACKEND_URL = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3456/graphql';

// You'll need to replace this with your actual auth token from cookies
const AUTH_TOKEN = 'YOUR_TOKEN_HERE';

const client = new GraphQLClient(BACKEND_URL, {
  headers: {
    Authorization: `Bearer ${AUTH_TOKEN}`,
  },
});

const mutation = gql`
  mutation EditTask($editTaskDto: EditTaskDto!) {
    editTask(editTaskDto: $editTaskDto) {
      _id
      name
      description
      date
      isCompleted
      createdAt
      updatedAt
      dog {
        _id
        name
      }
      vaccine {
        _id
        name
      }
      addedBy {
        _id
        name
      }
    }
  }
`;

// Test with just taskId and isCompleted
const variables = {
  editTaskDto: {
    taskId: '69273b16606e314e60330e9b', // Replace with actual task ID
    isCompleted: false
  }
};

console.log('🚀 Testing editTask mutation...');
console.log('Variables:', JSON.stringify(variables, null, 2));

client.request(mutation, variables)
  .then(data => {
    console.log('✅ Success!');
    console.log('Response:', JSON.stringify(data, null, 2));
  })
  .catch(error => {
    console.error('❌ Error:', error.message);
    if (error.response) {
      console.error('Response errors:', JSON.stringify(error.response.errors, null, 2));
      console.error('Response data:', JSON.stringify(error.response.data, null, 2));
    }
  });
