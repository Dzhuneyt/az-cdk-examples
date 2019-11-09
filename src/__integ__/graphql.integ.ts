import fetch from 'node-fetch';
(global as any).fetch = fetch;

import Amplify from '@aws-amplify/core';
import { GraphQLClient } from 'graphql-request';
import { initEnvars } from '@cpmech/envars';

const envars = {
  API_URL: '',
  USER_POOL_ID: '',
  USER_POOL_CLIENT_ID: '',
};

initEnvars(envars);

jest.setTimeout(100000);

Amplify.configure({
  Auth: {
    region: 'us-east-1',
    userPoolId: envars.USER_POOL_ID,
    userPoolWebClientId: envars.USER_POOL_CLIENT_ID,
  },
});

const expiredToken =
  'eyJraWQiOiJKUWlUMlhYclE4SlR1b1E3YmJkWVFVTVQwTTFtck1WSXBFVHJoMnBkc1wvVT0iLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJjNDczZDA2Ni04N2U1LTQ2YzctODMxMS0yYmQ1MzA5MWQ0ZjQiLCJhdWQiOiIxam12c2Rwcmlxa2NmcjNvZDUxaTBpOHUybiIsImNvZ25pdG86Z3JvdXBzIjpbImN1c3RvbWVycyIsInRlc3RlcnMiXSwiZW1haWxfdmVyaWZpZWQiOnRydWUsImV2ZW50X2lkIjoiYjZkYjhjYWQtMjcyZC00YTQxLTk5YzAtYWNmMGEwYWQ2NGYyIiwidG9rZW5fdXNlIjoiaWQiLCJhdXRoX3RpbWUiOjE1NzI4NjM3MzIsImlzcyI6Imh0dHBzOlwvXC9jb2duaXRvLWlkcC51cy1lYXN0LTEuYW1hem9uYXdzLmNvbVwvdXMtZWFzdC0xX29QOEhSWURlMCIsImNvZ25pdG86dXNlcm5hbWUiOiJjNDczZDA2Ni04N2U1LTQ2YzctODMxMS0yYmQ1MzA5MWQ0ZjQiLCJleHAiOjE1NzI4NjczMzQsImlhdCI6MTU3Mjg2MzczNCwiZW1haWwiOiJiZW5kZXJAZnV0dXJhbWEuY29tIn0.b5PgICNjOBSknHjq0kkhiScwykpGk8rU-bg8f613NtBzzlSMq9GG1ds0Z-odzI7a_2cKn9Yg5QbHTD68ZfdDTsf_x92GTLaSW9FuKnTS0uUCvAbaYlzWeBV1TgSH8DsghQ4Cwk5z9nDecgrOtfpjLF9OJ_ESij_pIGA2hXsHHqPOupYw0rp7eGKiGHDBQMRaqPtkNRCdRFBpZJ8QYrwt70xT54QRyi-k9_-tGSyuRVVmx0-rkUE9csSB_Di5cDDK9U-YBDdestcFy_uhSITct9ReDknnjHFO1-ZM_Y_Q1gL7JXqekhO3SEZu4Zeds2ThPCHioyrVZylDNyDAZMy9bw';

describe('graphql', () => {
  it('should block access without Bearer token', async () => {
    const client = new GraphQLClient(`${envars.API_URL}/graphql`);
    await expect(client.request(`query { version }`)).rejects.toThrowError(
      'GraphQL Error (Code: 401): ' +
        JSON.stringify({
          response: {
            message: 'Unauthorized',
            status: 401,
          },
          request: {
            query: 'query { version }',
          },
        }),
    );
  });

  it('should block unauthorized access', async () => {
    const client = new GraphQLClient(`${envars.API_URL}/graphql`, {
      headers: {
        authorization: `Bearer WRONG-TOKEN`,
      },
    });
    await expect(client.request(`query { version }`)).rejects.toThrowError(
      'GraphQL Error (Code: 401): ' +
        JSON.stringify({
          response: {
            message: 'Unauthorized',
            status: 401,
          },
          request: {
            query: 'query { version }',
          },
        }),
    );
  });

  it('should block expired token', async () => {
    const client = new GraphQLClient(`${envars.API_URL}/graphql`, {
      headers: {
        authorization: `Bearer ${expiredToken}`,
      },
    });
    await expect(client.request(`query { version }`)).rejects.toThrowError(
      'GraphQL Error (Code: 401): ' +
        JSON.stringify({
          response: {
            // message: 'The incoming token has expired',
            message: 'Unauthorized',
            status: 401,
          },
          request: {
            query: 'query { version }',
          },
        }),
    );
  });
});
