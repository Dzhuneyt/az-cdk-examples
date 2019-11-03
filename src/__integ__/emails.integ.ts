import { v4 } from 'uuid';
import { sendEmail, receiveEmail, deleteEmail, extractCodeFromEmail } from '@cpmech/az-senqs';
import { initEnvars } from '@cpmech/envars';

const envars = {
  EMAILS_DOMAIN: '',
  EMAILS_QUEUE_URL: '',
};

initEnvars(envars);

jest.setTimeout(20000);

describe('sendEmail, receiveEmail and deleteEmail', () => {
  test('works', async () => {
    const sender = `tester@${envars.EMAILS_DOMAIN}`;
    const receiver = `tester+${v4()}@${envars.EMAILS_DOMAIN}`;

    console.log('1: sending email');
    await sendEmail(sender, [receiver], 'CODE', 'Key = 123-456');

    console.log('2: receiving email');
    const res = await receiveEmail(receiver, envars.EMAILS_QUEUE_URL, 'us-east-1', 5);

    console.log('3: extracting code from email');
    const code = await extractCodeFromEmail(res.content, ['Key ='], 7);

    expect(code).toBe('123-456');

    console.log('4: deleting email');
    await deleteEmail(res.receiptHandle, envars.EMAILS_QUEUE_URL);
  });
});
