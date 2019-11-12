import axios from 'axios';
import { initEnvars } from '@cpmech/envars';

const envars = {
  API_URL: '',
  WEBSITE_DOMAIN: '',
};

initEnvars(envars);

jest.setTimeout(100000);

describe('API', () => {
  it('shoud access /open', async () => {
    const res = await axios.get(`${envars.API_URL}/open`);
    expect(res.status).toBe(200);
    expect(res.data).toEqual({
      message: `OPEN ACCESS: path = /open`,
    });
  });

  it('should not access /closed', async () => {
    let message = '';
    try {
      await axios.get(`${envars.API_URL}/closed`);
    } catch (err) {
      message = err.message;
    }
    expect(message).toBe('Request failed with status code 401');
  });
});

describe('API (using customDomain)', () => {
  test('/open', async () => {
    const customDomain = `api-dev.${envars.WEBSITE_DOMAIN}`;
    const res = await axios.get(`https://${customDomain}/open`);
    expect(res.status).toBe(200);
    expect(res.data).toEqual({
      message: `OPEN ACCESS: path = /open`,
    });
  });
});
