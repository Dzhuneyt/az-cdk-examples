import AWS from 'aws-sdk';
import { ILambdaCognito, IEventCognito } from '@cpmech/az-lambda';
import { sendEmail } from '@cpmech/az-senqs';

export const handler: ILambdaCognito = async (event: IEventCognito): Promise<any> => {
  const { email, userName } = event.request.userAttributes;
  console.log('>>> event = ', event);

  // send confirmation email
  if (email) {
    try {
      await sendEmail(
        'tester@azcdk.xyz',
        [email],
        `Welcome to AZCDK!`,
        `Your account has been created successfully`,
      );
    } catch (error) {
      console.log(error.message || JSON.stringify(error));
    }
  }

  // add user to group
  if (userName) {
    // cognito
    const cognito = new AWS.CognitoIdentityServiceProvider({
      apiVersion: '2016-04-18',
    });

    // create group if inexistent
    const groupParams = {
      GroupName: 'customers',
      UserPoolId: event.userPoolId,
    };
    try {
      await cognito.getGroup(groupParams).promise();
    } catch (error) {
      await cognito.createGroup(groupParams).promise();
    }

    // add to group
    const addUserParams = {
      GroupName: 'customers',
      UserPoolId: event.userPoolId,
      Username: userName,
    };
    await cognito.adminAddUserToGroup(addUserParams).promise();
  }

  // response
  return event;
};
