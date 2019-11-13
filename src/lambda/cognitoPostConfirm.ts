import { makeCognitoPostConfirmHandler } from '@cpmech/az-lambda';
import { initEnvars } from '@cpmech/envars';

const envars = {
  STAGE: '', // 'dev' or 'pro'
  DEFAULT_USER_GROUP: '',
  DEFAULT_USER_ROLE: '',
  TABLE_USERS_PREFIX: '',
  EMAILS_SENDING_DOMAIN: '',
};

initEnvars(envars);

const tableUsers = `${envars.TABLE_USERS_PREFIX}-${envars.STAGE.toUpperCase()}`;

const senderEmail = `admin@${envars.EMAILS_SENDING_DOMAIN}`;

export const handler = makeCognitoPostConfirmHandler(
  envars.DEFAULT_USER_GROUP,
  envars.DEFAULT_USER_ROLE,
  tableUsers,
  senderEmail,
  undefined,
  true,
);
