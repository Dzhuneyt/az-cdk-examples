import { IAmplifyConfig, GateStore } from 'gate';

const domainPrefix = process.env.REACT_APP_USER_POOL_DOMAIN_PREFIX || '';
const poolId = process.env.REACT_APP_USER_POOL_ID || '';
const clientId = process.env.REACT_APP_USER_POOL_CLIENT_ID || '';

const redirect = 'https://localhost:3000/';

const amplifyConfig: IAmplifyConfig = {
  userPoolId: poolId,
  userPoolWebClientId: clientId,
  oauthDomain: `${domainPrefix}.auth.us-east-1.amazoncognito.com`,
  redirectSignIn: redirect,
  redirectSignOut: redirect,
  awsRegion: 'us-east-1',
};

export const gate = new GateStore(amplifyConfig);
