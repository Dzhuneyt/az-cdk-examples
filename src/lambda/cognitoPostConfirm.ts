import { makeCognitoPostConfirmHandler } from '@cpmech/az-cdk';
import { initEnvars } from '@cpmech/envars';

const envars = {
  STAGE: '', // 'dev' or 'pro'
  DEFAULT_USER_GROUP: '',
  TABLE_USERS_PREFIX: '',
  EMAILS_DOMAIN: '',
};

initEnvars(envars);

const tableUsers = `${envars.TABLE_USERS_PREFIX}-${envars.STAGE.toUpperCase()}`;

const senderEmail = `tester@${envars.EMAILS_DOMAIN}`;

export const handler = makeCognitoPostConfirmHandler(
  envars.DEFAULT_USER_GROUP,
  tableUsers,
  senderEmail,
  undefined,
  true,
);
