import AWS from 'aws-sdk';
import { ILambdaCognito, IEventCognito } from '@cpmech/az-lambda';
import { sendEmail } from '@cpmech/az-senqs';

const GROUP_NAME = 'travellers';

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

  // send confirmation email
  console.log('... sending confirmation email ...');
  try {
    await sendEmail(
      'tester@azcdk.xyz',
      [email],
      `Welcome to AZCDK!`,
      `Hello${name ? ' ' + name : ''},

Your account has been created successfully.

Enjoy!

${info || ''}
`,
    );
  } catch (error) {
    console.log(error.message || JSON.stringify(error));
  }

  // add user to group
  // cognito
  const cognito = new AWS.CognitoIdentityServiceProvider({
    // apiVersion: '2016-04-18',
  });

  // create group if inexistent
  console.log('... creating group ...');
  const groupParams = {
    GroupName: GROUP_NAME,
    UserPoolId: event.userPoolId,
  };
  try {
    await cognito.getGroup(groupParams).promise();
  } catch (error) {
    /* ignore error: group does not exist */
    try {
      await cognito.createGroup(groupParams).promise();
    } catch (err) {
      console.log('... group creation failed:', err);
    }
  }

  // add to group
  console.log('... adding user to group ...');
  const addUserParams = {
    GroupName: GROUP_NAME,
    UserPoolId: event.userPoolId,
    Username: userName,
  };
  try {
    await cognito.adminAddUserToGroup(addUserParams).promise();
  } catch (error) {
    console.log('... failure when adding user to group:', error);
  }

  // add entry to database

  // response
  return event;
};
