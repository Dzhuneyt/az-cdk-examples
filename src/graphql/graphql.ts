import gql from 'graphql-tag';
import { DocumentNode, buildSchema, extendSchema } from 'graphql';
import { addResolveFunctionsToSchema } from 'graphql-tools';
import { ApolloServer } from 'apollo-server-lambda';
import { ErrorInternal } from '@cpmech/httpcodes';
import { mlog, elog } from '@cpmech/basic';
import { get, update } from '@cpmech/az-dynamo';
import { initEnvars } from '@cpmech/envars';
import { any2type } from '@cpmech/js2ts';
import { zeroAccess } from '../common';

const envars = {
  STAGE: '',
  AZCDK_TABLE_USERS: '',
};

initEnvars(envars);

const tableUsers = `${envars.AZCDK_TABLE_USERS}-${envars.STAGE.toUpperCase()}`;

const astAccess: DocumentNode = gql`
  enum Aspect {
    ACCESS
  }

  enum RoleOfUser {
    READER
    TRAVELLER
  }

  type Access {
    itemId: ID!
    aspect: Aspect!
    role: RoleOfUser!
    email: String!
    fullName: String
  }

  extend type Query {
    access(itemId: ID!): Access
  }

  input AccessInput {
    email: String
    fullName: String
  }

  extend type Mutation {
    setAccess(itemId: ID!, input: AccessInput!): Access!
  }
`;

const refData = zeroAccess();

const resolvers = {
  Query: {
    version: () => 'v0.1.0',
    access: async (_: any, args: any) => {
      const primaryKey = { itemId: args.itemId, aspect: 'ACCESS' };
      const data = await get(tableUsers, primaryKey);
      if (!data) {
        return null;
      }
      const res = any2type(refData, data);
      if (!res) {
        throw new ErrorInternal(`database is damaged. itemId = ${args.itemId}`);
      }
      return res;
    },
  },

  Mutation: {
    setVersion: () => 'v0.1.0', // NOTE: cannot set version at this time
    setAccess: async (_: any, args: any) => {
      const primaryKey = { itemId: args.itemId, aspect: 'ACCESS' };
      const data = await update(tableUsers, primaryKey, args.input);
      const res = any2type(refData, data);
      if (!res) {
        throw new ErrorInternal(`database is damaged. itemId = ${args.itemId}`);
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

const apollo = new ApolloServer({
  schema,
  playground: true,
  introspection: true,
  context: ({ event, context }) => ({
    headers: event.headers,
    functionName: context.functionName,
    event,
    context,
  }),
  formatError: error => {
    elog(error);
    return error;
  },
  formatResponse: (response: any) => {
    if (response?.data?.__schema) {
      return response;
    }
    mlog(response);
    return response;
  },
});

export const server = apollo.createHandler({
  cors: {
    origin: '*',
    credentials: true,
  },
});
