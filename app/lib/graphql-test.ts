import { graphql, buildSchema } from 'graphql';

// Define a simple GraphQL schema
const schema = buildSchema(`
  type Query {
    hello: String
  }
`);

// Define the resolver for the schema
const root = {
  hello: () => 'Hello, GraphQL!',
};

// Execute a test query
graphql({
  schema,
  source: '{ hello }',
  rootValue: root,
}).then((response) => {
  console.log(response);
}).catch((error) => {
  console.error('Error executing GraphQL query:', error);
});
