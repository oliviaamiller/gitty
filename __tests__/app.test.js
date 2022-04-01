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
    const req = await request(app)
      .get('/api/v1/github/login');

    expect(req.header.location).toMatch('https://github.com/login/oauth/authorize?client_id=undefined&scope=user&redirect_uri=undefined');
  });


  it('should callback URI for Github to redirect to after log in', async () => {
    const req = await request
      .agent(app)
      .get('/api/v1/github/login/callback?code=42')
      .redirects(1);

    expect(req.body).toEqual({
      id: expect.any(String),
      username: 'Ernie',
      email: 'meow@meow.meow',
      avatar: expect.any(String),
      iat: expect.any(Number),
      exp: expect.any(Number)
    });

  });


});
