import { open } from './open';
import { zeroEvent, zeroContext } from '@cpmech/az-lambda';

describe('open', () => {
  test('works', async () => {
    const res = await open(zeroEvent, zeroContext);
    expect(res.body).toBe(JSON.stringify({ message: `OPEN ACCESS: path = ` }));
  });
});
