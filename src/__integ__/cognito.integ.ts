import fetch from 'node-fetch';
(global as any).fetch = fetch;

import Amplify from '@aws-amplify/core';
import Auth from '@aws-amplify/auth';
import { v4 } from 'uuid';
import { deleteUser, findUser } from '@cpmech/az-cognito';
import {
  deleteEmail,
  receiveEmail,
  extractCodeFromEmail,
  extractSubjectAndMessage,
} from '@cpmech/az-senqs';
import { sleep } from '@cpmech/basic';
import { initEnvars } from '@cpmech/envars';

const envars = {
  USER_POOL_ID: '',
  USER_POOL_CLIENT_ID: '',
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
let emailReceiptHandle: string = '';

const cleanUp = async () => {
  try {
    if (emailReceiptHandle) {
      await deleteEmail(emailReceiptHandle, envars.EMAILS_QUEUE_URL);
      console.log('... email deleted successfully ...');
    }
    if (username) {
      await deleteUser(username, envars.USER_POOL_ID);
      console.log('... user deleted successfully ...');
    }
  } catch (err) {
    console.log(err);
  }
};

beforeEach(() => {
  email = `tester+${v4()}@azcdk.xyz`;
  username = '';
  emailReceiptHandle = '';
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

    sleep(1000);
    console.log('2: receiving email');
    const r = await receiveEmail(email, envars.EMAILS_QUEUE_URL);
    emailReceiptHandle = r.receiptHandle;

    console.log('3: extracting code from email');
    const code = await extractCodeFromEmail(r.content);
    console.log('>>> code = ', code);

    console.log('4: confirming email with given code');
    await Auth.confirmSignUp(username, code);
    const userJustConfirmed = await findUser(email, envars.USER_POOL_ID);
    expect(userJustConfirmed.Data.email).toBe(email);
    expect(userJustConfirmed.Data.email_verified).toBe('true');

    console.log('5: signing in');
    const user = await Auth.signIn({ username, password });
    expect(user.attributes.email_verified).toBe(true);

    sleep(1000);
    console.log('6: receive confirmation email');
    const rc = await receiveEmail(email, envars.EMAILS_QUEUE_URL);
    const sm = await extractSubjectAndMessage(rc.content);
    expect(sm).toEqual({
      subject: 'Welcome to AZCDK!',
      message: 'Your account has been created successfully\n',
    });
  });
});
