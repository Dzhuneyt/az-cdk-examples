import { ILambdaCognito, IEventCognito } from '@cpmech/az-lambda';
import { sendEmail } from '@cpmech/az-senqs';
import { addUserToGroup } from '@cpmech/az-cognito';
import { update } from '@cpmech/az-dynamo';
import { any2type } from '@cpmech/js2ts';
import { initEnvars } from '@cpmech/envars';
import { newAccess, IAccess } from './types';

const envars = {
  STAGE: '', // 'dev' or 'pro'
  DEFAULT_USER_GROUP: '',
  TABLE_USERS_PREFIX: '',
  EMAILS_DOMAIN: '',
};

initEnvars(envars);

const usersTable = `${envars.TABLE_USERS_PREFIX}-${envars.STAGE.toUpperCase()}`;

const refData = newAccess();

const setAccessInUsersTable = async (userId: string, email: string) => {
  // add entry to database
  const inputData: IAccess = {
    ...newAccess(),
    userId,
    email,
  };
  delete inputData.userId;
  delete inputData.aspect;
  const primaryKey = { userId, aspect: 'ACCESS' };
  const newData = await update(usersTable, primaryKey, inputData);

  // check new data
  const res = any2type(refData, newData);
  if (!res) {
    throw new Error(`database is damaged`);
  }
};

const sendConfrimationEmail = async (
  from: string,
  to: string,
  name: string | undefined,
  info: string | undefined,
) => {
  await sendEmail(
    from,
    [to],
    `Welcome to AZCDK!`,
    `Hello${name ? ' ' + name : ''},

Your account has been created successfully.

Enjoy!

${info || ''}
`,
  );
};

export const handler: ILambdaCognito = async (event: IEventCognito): Promise<any> => {
  const { userName } = event;
  const { email, name } = event.request.userAttributes;
  console.log('>>> event = ', event);

  // check
  if (!userName) {
    throw new Error('cannot get userName from event data');
  }
  if (!email) {
    throw new Error('cannot get email from event data');
  }

  // status
  const status = event.request.userAttributes['cognito:user_status'];
  let info = '';
  if (status === 'EXTERNAL_PROVIDER') {
    const provider = userName.split('_')[0];
    info = `(account created with ${provider} credentials)`;
    console.log(info);
  }

  // add user to group
  await addUserToGroup(event.userPoolId, userName, envars.DEFAULT_USER_GROUP, true);

  // set dynamodb table
  console.log('... setting access in user table ...');
  await setAccessInUsersTable(userName, email);

  // send confirmation email
  console.log('... sending confirmation email ...');
  await sendConfrimationEmail(`tester@${envars.EMAILS_DOMAIN}`, email, name, info);

  // response
  return event;
};
