import { initEnvars } from '@cpmech/envars';

export const envars = {
  STAGE: '', // 'dev' or 'pro'
  USER_POOL_ID: '',
  EMAILS_DOMAIN: '',
  WEBSITE_DOMAIN: '',
  WEBSITE_CERTIFICATE_ARN: '',
  WEBSITE_CLOUDFRONT_ID: '',
  WEBSITE_HOSTED_ZONE_ID: '',
  PIPELINE_NOTIFICATION_EMAILS: '',
  FACEBOOK_CLIENT_ID: '',
  FACEBOOK_CLIENT_SECRET: '',
  GOOGLE_CLIENT_ID: '',
  GOOGLE_CLIENT_SECRET: '',
};

initEnvars(envars);
