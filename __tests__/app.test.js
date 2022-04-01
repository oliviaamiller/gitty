const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const GithubUser = require('../lib/models/GithubUser');

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

    expect(res.header.location).toMatch(`https://github.com/login/oauth/authorize?client_id=${process.env.CLIENT_ID}&scope=user&redirect_uri=${process.env.REDIRECT_URI}`);
  });


  it('redirects to posts when logged in', async () => {
    const res = await request
      .agent(app)
      .get('/api/v1/github/login/callback?code=42')
      .redirects(1);

    expect(res.req.path).toEqual('/api/v1/posts');

  });

  it ('signs out a user', async () => {
    const res = await request(app)
      .delete('/api/v1/github');

    expect(res.body).toEqual({
      success: true,
      message: 'You have signed out'
    });
  });

  it ('lists all posts for all signed in users', async () => {
    const agent = request.agent(app);

    const res = await agent
      .get('/api/v1/posts');

    const expected = [{
      id: expect.any(String),
      text: 'my first post!'
    }];

    expect(res.body).toEqual(expected);
    
  });


});
