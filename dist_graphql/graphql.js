'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var gql = _interopDefault(require('graphql-tag'));
var graphql = require('graphql');
var graphqlTools = require('graphql-tools');
var apolloServerLambda = require('apollo-server-lambda');
var awsSdk = require('aws-sdk');

const e={success:{ok:200,created:201,accepted:202},redirect:{movedPermanently:301,found:302,seeOther:303},clientError:{badRequest:400,unauthorized:401,forbidden:403,notFound:404,unprocessable:422},serverError:{internal:500}},r={success:{ok:"200-OK: The request has succeeded",created:"201-Created: The request has succeeded and a new resource has been created",accepted:"202-Accepted: The request has been received but not yet acted upon"},redirect:{movedPermanently:"301-MovedPerm: The URI has been moved permanently",found:"302-MovedTemp: Found, but the URI has been moved temporarily",seeOther:"303-SeeOther: See other. Use another URI with a GET request"},clientError:{badRequest:"400-BadRequest: The server could not understand the request due to invalid syntax",unauthorized:"401-Unauthenticated: The client must authenticate itself first",forbidden:"403-Forbidden: The client, known to the server, does not have access rights",notFound:"404-NotFound: The server can not find requested resource",unprocessable:"422-Unprocessable: The request is well formed but has semantic errors"},serverError:{internal:"500-Internal: The server cannot handle this request"}};class s extends Error{constructor(t=r.clientError.badRequest){super(t),this.code=e.clientError.badRequest;}}class u extends Error{constructor(t=r.serverError.internal){super(t),this.code=e.serverError.internal;}}

const n=async(t,n)=>{const s=new awsSdk.DynamoDB.DocumentClient;return !!(await s.get({TableName:t,Key:n,AttributesToGet:Object.keys(n)}).promise()).Item},s$1=async(t,n)=>{const s=new awsSdk.DynamoDB.DocumentClient,a=await s.get({TableName:t,Key:n}).promise();return a.Item?a.Item:null},c=e=>{const t=Object.keys(e);return {UpdateExpression:"SET "+[...t.map((e,t)=>`#y${t} = :x${t}`)].join(", "),ExpressionAttributeNames:t.reduce((e,t,n)=>({...e,[`#y${n}`]:t}),{}),ExpressionAttributeValues:t.reduce((t,n,s)=>({...t,[`:x${s}`]:e[n]}),{})}},l=async(t,n,s)=>{if(0===Object.keys(s).length)return null;const a=new awsSdk.DynamoDB.DocumentClient,r=c(s),i=await a.update({TableName:t,Key:n,ReturnValues:"ALL_NEW",...r}).promise();return i.Attributes?i.Attributes:null};

const b=(e,t)=>Object.prototype.hasOwnProperty.call(e,t);

const r$1=(r,n=!1)=>{Object.keys(r).forEach(o=>{if(!b(process.env,o))throw new Error(`cannot find environment variable named "${o}"`);const t=process.env[o];if(!n&&!t)throw new Error(`environment variable "${o}" must not be empty`);r[o]=t;});};

function e$1(t,e,n){if(!Object.prototype.hasOwnProperty.call(e,n))return !1;const o=typeof t[n];return typeof e[n]===o}const n$1=(t,e="")=>{t?(console.log(`[ERROR] object = ${JSON.stringify(t)}`),console.log(`[ERROR] property for key = ${e} doesn't exist or has incorrect type`)):console.log("[ERROR] object is null");};function o(t,r,l=!1,c){if(!r)return l&&n$1(r),null;const s={},f=Object.keys(t);for(const i of f){if(c&&c[i]&&!Object.prototype.hasOwnProperty.call(r,i))continue;if(!e$1(t,r,i))return l&&n$1(r,i),null;const f=r[i];if(Array.isArray(t[i]))s[i]=f.slice(0);else if("object"==typeof t[i]){const e=o(t[i],f,l);if(!e)return null;s[i]=e;}else s[i]=f;}return s}

const newAccess = () => ({
    userId: '',
    aspect: 'ACCESS',
    role: 'TRAVELLER',
    email: '',
});

const envars = {
    STAGE: '',
    TABLE_USERS_PREFIX: '',
};
r$1(envars);
const tableUsers = `${envars.TABLE_USERS_PREFIX}-${envars.STAGE.toUpperCase()}`;
const astAccess = gql `
  enum Aspect {
    ACCESS
  }

  enum RoleOfUser {
    READER
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
        version: (source, args, context, info) => 'v0.1.0',
        access: async (source, args, context, info) => {
            console.log('.... .... .... access called .... .... ....');
            // extract userId
            const { userId } = args;
            // check if userId is given
            if (!userId) {
                throw new s('userId is missing');
            }
            // DynamoDB primary key
            const primaryKey = { userId, aspect: 'ACCESS' };
            console.log('.... primaryKey = ', primaryKey);
            // get data from DB
            const data = await s$1(tableUsers, primaryKey);
            if (!data) {
                return null;
            }
            console.log('.... dynamo data = ', data);
            // check and return data
            const res = o(refData, data);
            if (!res) {
                throw new u(`database is damaged. userId = ${userId}`);
            }
            return res;
        },
    },
    Mutation: {
        setVersion: (source, args, context, info) => 'v0.1.0',
        setAccess: async (source, args, context, info) => {
            console.log('.... .... .... setAccess called .... .... ....');
            // check if input is given
            if (!args || !args.input) {
                throw new s('input data is missing');
            }
            // extract input
            const { input } = args;
            // check if userId is given
            if (!input.userId) {
                throw new s('userId is missing');
            }
            // DynamoDB primary key
            const { userId } = input;
            const primaryKey = { userId, aspect: 'ACCESS' };
            console.log('.... primaryKey = ', primaryKey);
            // set input data
            let inputData = input;
            if (!(await n(tableUsers, primaryKey))) {
                inputData = {
                    ...newAccess(),
                    ...input,
                };
            }
            console.log('.... inputData = ', inputData);
            // remove userId and aspect
            delete inputData.userId;
            delete inputData.aspect;
            // check if there is data to be updated
            if (Object.keys(input).length === 0) {
                throw new s('there is no data to be updated');
            }
            // update data in DB
            const data = await l(tableUsers, primaryKey, inputData);
            console.log('.... dynamo data = ', data);
            // check and return data
            const res = o(refData, data);
            if (!res) {
                throw new u(`database is damaged. userId = ${userId}`);
            }
            return res;
        },
    },
};
const rootSchema = graphql.buildSchema(`
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
const schema = graphql.extendSchema(rootSchema, astAccess);
graphqlTools.addResolveFunctionsToSchema({ schema, resolvers });
const apollo = new apolloServerLambda.ApolloServer({ schema });
const server = apollo.createHandler({
    cors: {
        origin: '*',
        credentials: true,
    },
});

exports.server = server;
