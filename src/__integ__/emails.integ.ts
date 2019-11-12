import { v4 } from 'uuid';
import { sendEmail, receiveEmail, deleteEmail, extractCodeFromEmail } from '@cpmech/az-senqs';
import { sleep } from '@cpmech/basic';
import { initEnvars } from '@cpmech/envars';

const envars = {
  EMAILS_SENDING_DOMAIN: '',
  EMAILS_RECEIVING_DOMAIN: '',
  EMAILS_QUEUE_URL: '',
};

initEnvars(envars);

jest.setTimeout(100000);

describe('sendEmail, receiveEmail and deleteEmail', () => {
  test('works', async () => {
    const sender = `tester@${envars.EMAILS_SENDING_DOMAIN}`;
    const receiver = `tester+${v4()}@${envars.EMAILS_RECEIVING_DOMAIN}`;

    console.log('1: sending email');
    await sendEmail(sender, [receiver], 'CODE', 'Key = 123-456');

    console.log('2: receiving email');
    const res = await receiveEmail(receiver, envars.EMAILS_QUEUE_URL, 'us-east-1', 20, 2000);

    console.log('3: extracting code from email');
    const code = await extractCodeFromEmail(res.content, ['Key ='], 7);

    expect(code).toBe('123-456');

    console.log('4: deleting email');
    await deleteEmail(res.receiptHandle, envars.EMAILS_QUEUE_URL);
  });
});
