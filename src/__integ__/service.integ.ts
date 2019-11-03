import axios from 'axios';
import { request } from 'graphql-request';
import { initEnvars } from '@cpmech/envars';

const envars = {
  API_URL: '',
  WEBSITE_DOMAIN: '',
};

initEnvars(envars);

jest.setTimeout(10000);

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

  it('should return the version using the route /graphql', async () => {
    const res = await axios.post(`${envars.API_URL}/graphql`, { query: '{ version }' });
    expect(res.status).toBe(200);
    expect(res.data).toEqual({
      data: {
        version: 'v0.1.0',
      },
    });
  });

  it('should create user using the route /graphql', async () => {
    const res = await request(
      `${envars.API_URL}/graphql`,
      `
      mutation SetAccess($input:AccessInput!) {
        setAccess(input:$input) {
          userId
          aspect
          email
          confirmed
        }
      }
    `,
      {
        input: {
          userId: '123-test-123',
          aspect: 'ACCESS',
          email: 'just.testing@this.com',
          confirmed: true,
        },
      },
    );
    expect(res).toEqual({
      setAccess: {
        userId: '123-test-123',
        aspect: 'ACCESS',
        email: 'just.testing@this.com',
        confirmed: true,
      },
    });
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
