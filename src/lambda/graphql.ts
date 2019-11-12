import gql from 'graphql-tag';
import { DocumentNode, buildSchema, extendSchema } from 'graphql';
import { addResolveFunctionsToSchema } from 'graphql-tools';
import { ApolloServer } from 'apollo-server-lambda';
import { ErrorBadRequest, ErrorInternal } from '@cpmech/httpcodes';
import { get, exists, update } from '@cpmech/az-dynamo';
import { any2type } from '@cpmech/js2ts';
import { newAccess } from './types';

const astAccess: DocumentNode = gql`
  enum Aspect {
    ACCESS
  }

  enum RoleOfUser {
    TRAVELLER
  }

  type Access {
    userId: ID!
    aspect: Aspect!
    role: RoleOfUser!
    email: String!
  }

  extend type Query {
    access(userId: ID!): Access
  }

  input AccessInput {
    userId: ID!
    aspect: Aspect
    role: RoleOfUser
    email: String
  }

  extend type Mutation {
    setAccess(input: AccessInput!): Access!
  }
`;

const refData = newAccess();

const resolvers = {
  Query: {
    version: (source: any, args: any, context: any, info: any) => 'v0.1.0',

    access: async (source: any, args: any, context: any, info: any) => {
      // extract userId
      const { userId } = args;

      // check if userId is given
      if (!userId) {
        throw new ErrorBadRequest('userId is missing');
      }

      // DynamoDB primary key
      const primaryKey = { userId, aspect: 'ACCESS' };

      // get data from DB
      const data = await get('USERS', primaryKey);
      if (!data) {
        return null;
      }

      // check and return data
      const res = any2type(refData, data);
      if (!res) {
        throw new ErrorInternal(`database is damaged. userId = ${userId}`);
      }
      return res;
    },
  },

  Mutation: {
    setVersion: (source: any, args: any, context: any, info: any) => 'v0.1.0', // NOTE: cannot set version at this time

    setAccess: async (source: any, args: any, context: any, info: any) => {
      // check if input is given
      if (!args || !args.input) {
        throw new ErrorBadRequest('input data is missing');
      }

      // extract input
      const { input } = args;

      // check if userId is given
      if (!input.userId) {
        throw new ErrorBadRequest('userId is missing');
      }

      // DynamoDB primary key
      const { userId } = input;
      const primaryKey = { userId, aspect: 'ACCESS' };

      // set input data
      let inputData = input;
      if (!(await exists('USERS', primaryKey))) {
        inputData = {
          ...newAccess(),
          ...input,
        };
      }

      // remove userId and aspect
      delete inputData.userId;
      delete inputData.aspect;

      // check if there is data to be updated
      if (Object.keys(input).length === 0) {
        throw new ErrorBadRequest('there is no data to be updated');
      }

      // update data in DB
      const data = await update('USERS', primaryKey, inputData);

      // check and return data
      const res = any2type(refData, data);
      if (!res) {
        throw new ErrorInternal(`database is damaged. userId = ${userId}`);
      }
      return res;
    },
  },
};

const rootSchema = buildSchema(`
  """
  Returns the server version
  (in fact, this is a trick to allow using 'extend type Query')
  """
  type Query {
    version: String!
  }

  """
  Sets the server version
  (in fact, this is a trick to allow using 'extend type Mutation')
  """
  type Mutation {
    setVersion(value: String!): String!
  }
`);

const schema = extendSchema(rootSchema, astAccess);

addResolveFunctionsToSchema({ schema, resolvers });

const apollo = new ApolloServer({ schema });

export const server = apollo.createHandler({
  cors: {
    origin: '*',
    credentials: true,
  },
});
