import gql from 'graphql-tag';
import { DocumentNode } from 'graphql';
import { ApolloServer } from 'apollo-server-lambda';

const typeDefs: DocumentNode = gql`
  type Query {
    hello: String
  }
`;

const resolvers = {
  Query: {
    hello: () => 'Hello graphql!',
  },
};

const apollo = new ApolloServer({ typeDefs, resolvers });

export const server = apollo.createHandler();
