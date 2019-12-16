import { makeCognitoPostConfirmHandler } from '@cpmech/az-lambda';
import { initEnvars } from '@cpmech/envars';

const envars = {
  STAGE: '', // 'dev' or 'pro'
  DEFAULT_USER_GROUP: '',
  TABLE_USERS_PREFIX: '',
  EMAILS_SENDING_DOMAIN: '',
};

initEnvars(envars);

const tableUsers = `${envars.TABLE_USERS_PREFIX}-${envars.STAGE.toUpperCase()}`;

const senderEmail = `admin@${envars.EMAILS_SENDING_DOMAIN}`;

interface IData {
  userId: string;
  aspect: string;
  email: string;
}

const reference: IData = {
  userId: '',
  aspect: '',
  email: '',
};

const verbose = true;
const emailMaker = undefined;

export const handler = makeCognitoPostConfirmHandler(
  envars.DEFAULT_USER_GROUP,
  senderEmail,
  verbose,
  emailMaker,
  tableUsers,
  reference,
);
