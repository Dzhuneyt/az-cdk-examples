import { makeCognitoPostConfirmHandler, IUpdateDb } from '@cpmech/az-cognito';
import { update } from '@cpmech/az-dynamo';
import { initEnvars } from '@cpmech/envars';
import { IAccess } from '../common';

const envars = {
  STAGE: '',
  AZCDK_DEFAULT_USER_GROUP: '',
  AZCDK_TABLE_USERS_PREFIX: '',
  AZCDK_EMAILS_SENDING_DOMAIN: '',
};

initEnvars(envars);

const tableUsers = `${envars.AZCDK_TABLE_USERS_PREFIX}-${envars.STAGE.toUpperCase()}`;
const defaultUserGroup = envars.AZCDK_DEFAULT_USER_GROUP;
const senderEmail = `admin@${envars.AZCDK_EMAILS_SENDING_DOMAIN}`;

const updateDb: IUpdateDb = async (userName: string, email: string, name?: string) => {
  const data: Omit<IAccess, 'itemId' | 'aspect'> = name
    ? { role: 'TRAVELLER', email, fullName: name }
    : { role: 'TRAVELLER', email };
  await update(tableUsers, { itemId: userName, aspect: 'ACCESS' }, data);
};

export const handler = makeCognitoPostConfirmHandler({
  defaultUserGroup,
  senderEmail,
  updateDb,
});
