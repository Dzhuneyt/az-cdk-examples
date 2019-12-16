import fetch from 'node-fetch';
(global as any).fetch = fetch;
import Amplify from '@aws-amplify/core';
import Auth from '@aws-amplify/auth';
import { getToken } from '@cpmech/az-cognito';
import { initEnvars } from '@cpmech/envars';

const envars = {
  EMAILS_SENDING_DOMAIN: '',
  TESTER_USER_PASSWORD: '',
  USER_POOL_ID: '',
  USER_POOL_CLIENT_ID: '',
};

initEnvars(envars);

Amplify.configure({
  Auth: {
    region: 'us-east-1',
    userPoolId: envars.USER_POOL_ID,
    userPoolWebClientId: envars.USER_POOL_CLIENT_ID,
  },
});

const runGetToken = async (password: string) => {
  const email = `tester@${envars.EMAILS_SENDING_DOMAIN}`;
  console.log('=============================================================');
  console.log(`signing in`);
  console.log(`>>> email = ${email}`);
  const user = await Auth.signIn({ username: email, password });
  // const session = await Auth.currentSession();
  // console.log(`>>> session = ${JSON.stringify(session, undefined, 2)}`);
  const idToken = getToken(user);
  console.log(`>>> idToken = ${JSON.stringify(idToken, undefined, 2)}`);
};

(async () => {
  try {
    await runGetToken(envars.TESTER_USER_PASSWORD);
  } catch (error) {
    console.log('ERROR: ', error);
  }
})();
