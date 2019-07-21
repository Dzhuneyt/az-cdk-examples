import { closed } from './closed';
import { zeroEvent, zeroContext } from '@cpmech/az-lambda';

describe('closed', () => {
  test('works', async () => {
    const res = await closed(zeroEvent, zeroContext);
    expect(res.body).toBe(JSON.stringify({ message: `RESTRICTED: path = ` }));
  });
});
