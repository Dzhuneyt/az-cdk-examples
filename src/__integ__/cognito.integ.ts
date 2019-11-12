import fetch from 'node-fetch';
(global as any).fetch = fetch;

import Amplify from '@aws-amplify/core';
import Auth from '@aws-amplify/auth';
import { v4 } from 'uuid';
import { defaultEmailMaker } from '@cpmech/az-lambda';
import { adminDeleteUser, adminFindUserByEmail, getTokenPayload } from '@cpmech/az-cognito';
import {
  deleteEmail,
  receiveEmail,
  extractCodeFromEmail,
  extractSubjectAndMessage,
  IQueueEmail,
} from '@cpmech/az-senqs';
import { sleep } from '@cpmech/basic';
import { initEnvars } from '@cpmech/envars';

const envars = {
  USER_POOL_ID: '',
  USER_POOL_CLIENT_ID: '',
  DEFAULT_USER_GROUP: '',
  EMAILS_QUEUE_URL: '',
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

const password = '123paSSword$';
let email: string = '';
let username: string = '';

const cleanUp = async () => {
  try {
    if (username) {
      await adminDeleteUser(envars.USER_POOL_ID, username);
      console.log('... user deleted successfully ...');
    }
  } catch (err) {
    console.log(err);
  }
};

beforeEach(() => {
  email = `tester+${v4()}@azcdk.xyz`;
  username = '';
});

afterEach(async () => {
  await cleanUp();
});

describe('cognito', () => {
  it('should signUp, confirm, and signIn successfully', async () => {
    console.log('1: signing up');
    const res = await Auth.signUp({
      username: email,
      password,
    });
    username = res.userSub; // username = res.user.getUsername(); // <<< this gives the email instead
    console.log('>>> username = ', username);
    expect(res.userConfirmed).toBe(false);

    console.log('2: receiving email');
    const emailCode = await receiveEmail(email, envars.EMAILS_QUEUE_URL, 'us-east-1', 20, 2000);

    console.log('3: deleting email');
    await deleteEmail(emailCode.receiptHandle, envars.EMAILS_QUEUE_URL);

    console.log('4: extracting code from email');
    const code = await extractCodeFromEmail(emailCode.content);
    console.log('>>> code = ', code);

    console.log('5: confirming email with given code');
    await Auth.confirmSignUp(username, code);
    const userJustConfirmed = await adminFindUserByEmail(envars.USER_POOL_ID, email);
    expect(userJustConfirmed.Data.email).toBe(email);
    expect(userJustConfirmed.Data.email_verified).toBe('true');

    console.log('6: signing in');
    const user = await Auth.signIn({ username, password });
    expect(user.attributes.email_verified).toBe(true);

    console.log('7: receiving confirmation email');
    const emailConfirm = await receiveEmail(email, envars.EMAILS_QUEUE_URL, 'us-east-1', 20, 2000);

    console.log('8: deleting email');
    await deleteEmail(emailConfirm.receiptHandle, envars.EMAILS_QUEUE_URL);

    console.log('9: checking confirmation message');
    const sm = await extractSubjectAndMessage(emailConfirm.content);
    expect(sm).toEqual(defaultEmailMaker(email));

    console.log('10: checking group');
    const payload = await getTokenPayload(user);
    expect(payload['cognito:groups']).toEqual([envars.DEFAULT_USER_GROUP]);
  });
});
