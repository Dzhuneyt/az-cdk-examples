import { initEnvars } from '@cpmech/envars';
import { config } from './config';

const app = config.appName;

export const envars = {
  STAGE: '', // 'dev' or 'pro'
  API_URL: '',

  USER_POOL_ID: '',
  USER_POOL_CLIENT_ID: '',
  DEFAULT_USER_GROUP: '',
  TESTER_USER_PASSWORD: '',
  FACEBOOK_CLIENT_ID: '',
  FACEBOOK_CLIENT_SECRET: '',
  GOOGLE_CLIENT_ID: '',
  GOOGLE_CLIENT_SECRET: '',

  EMAILS_SENDING_DOMAIN: '',
  EMAILS_RECEIVING_DOMAIN: '',
  EMAILS_RECEIVING_HOSTED_ZONE_ID: '',
  EMAILS_RECEIVING_CERT_ARN: '',
  EMAILS_QUEUE_URL: '',

  WEBSITE_DOMAIN: '',
  WEBSITE_HOSTED_ZONE_ID: '',
  WEBSITE_CERTIFICATE_ARN: '',
  WEBSITE_CLOUDFRONT_ID: '',

  TABLE_PARAMS_PREFIX: '',
  TABLE_USERS_PREFIX: '',

  PIPELINE_NOTIFICATION_EMAILS: '',
};

initEnvars(envars);

export const cfg = {
  prefix: `${app}-${envars.STAGE}`,
  poolName: `${app}-${envars.STAGE}-users`,
  testerEmail: `tester@${envars.WEBSITE_DOMAIN}`,
  senderEmail: `tester@${envars.EMAILS_SENDING_DOMAIN}`,
  receiverEmails: [
    `admin@${envars.EMAILS_RECEIVING_DOMAIN}`,
    `tester@${envars.EMAILS_RECEIVING_DOMAIN}`,
  ],
  appUrl: `https://app.${envars.WEBSITE_DOMAIN}/`,
  tableParams: `${envars.TABLE_USERS_PREFIX}-${envars.STAGE.toUpperCase()}`,
  tableUsers: `${envars.TABLE_USERS_PREFIX}-${envars.STAGE.toUpperCase()}`,
  gatewayName: `${app}-${envars.STAGE}-api`,
  websiteBucketName: `${envars.WEBSITE_DOMAIN}-website`,
  appWebsiteBucketName: `app.${envars.WEBSITE_DOMAIN}-app`,
};

console.log('\ncfg =\n', cfg, '\n');
