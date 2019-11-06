import { ILambdaCognito, IEventCognito } from '@cpmech/az-lambda';
import { sendEmail } from '@cpmech/az-senqs';

export const postConfirm: ILambdaCognito = async (event: IEventCognito): Promise<any> => {
  const { email } = event.request.userAttributes;
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
  return event;
};
