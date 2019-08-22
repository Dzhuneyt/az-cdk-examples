import axios from 'axios';
import { initEnvars } from '@plabs/envars';

const envars = {
  API1_URL: '',
};

initEnvars(envars);

jest.setTimeout(10000);

const r1 = { message: `OPEN ACCESS: path = /open` };
const r2 = {
  data: {
    hello: `Hello, GraphQL!`,
  },
};

describe('API-1', () => {
  test('/open', async () => {
    const res = await axios.get(`${envars.API1_URL}/open`);
    expect(res.status).toBe(200);
    expect(res.data).toEqual(r1);
  });

  test('/closed', async () => {
    let message = '';
    try {
      await axios.get(`${envars.API1_URL}/closed`);
    } catch (err) {
      message = err.message;
    }
    expect(message).toBe('Request failed with status code 401');
  });

  test('/graphql', async () => {
    const res = await axios.post(`${envars.API1_URL}/graphql`, { query: '{ hello }' });
    expect(res.status).toBe(200);
    expect(res.data).toEqual(r2);
  });
});
