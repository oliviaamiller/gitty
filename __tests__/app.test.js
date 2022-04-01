const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');

jest.mock('../lib/utils/github');

describe('gitty routes', () => {
  beforeEach(() => {
    return setup(pool);
  });

  afterAll(() => {
    pool.end();
  });

  it('redirects to github oauth page when logging in', async () => {
    const res = await request(app)
      .get('/api/v1/github/login');

    expect(res.header.location).toMatch('https://github.com/login/oauth/authorize?client_id=12e87002258f49409c96&scope=user&redirect_uri=http://localhost:7890/api/v1/github/login/callback');
  });


  it('redirects to posts when logged in', async () => {
    const res = await request
      .agent(app)
      .get('/api/v1/github/login/callback?code=42')
      .redirects(1);

    expect(res.req.path).toEqual('/api/v1/posts');

  });


});
