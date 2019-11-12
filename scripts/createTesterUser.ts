import { adminCreateUsers, IUserInput } from '@cpmech/az-cognito';
import { initEnvars } from '@cpmech/envars';

const envars = {
  USER_POOL_ID: '',
  USER_POOL_CLIENT_ID: '',
  TESTER_USER_PASSWORD: '',
  WEBSITE_DOMAIN: '',
};

initEnvars(envars);

const users: IUserInput[] = [
  {
    email: `tester@${envars.WEBSITE_DOMAIN}`,
    password: envars.TESTER_USER_PASSWORD,
    groups: 'testers',
  },
];

(async () => {
  await adminCreateUsers(envars.USER_POOL_ID, envars.USER_POOL_CLIENT_ID, users);
})();
