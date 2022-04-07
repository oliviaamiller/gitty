const { Router } = require('express');
const jwt = require('jsonwebtoken');
const GithubUser = require('../models/GithubUser');
const ONE_DAY_IN_MS = 1000 * 60 * 60 * 24;
const GithubUserService = require('../services/GithubUserService');

module.exports = Router()
  .get('/login', (req, res) => {
    res.redirect(`https://github.com/login/oauth/authorize?client_id=${process.env.CLIENT_ID}&scope=user&redirect_uri=${process.env.REDIRECT_URI}`);
  })

  .get('/login/callback', async (req, res) => {
    const { code } = req.query;

    const token = await exchangeToken(code);

    const profile = await fetchProfile(token);

    let user = await GithubUser.getByUsername(profile.login);

    if (!user) {
      user = await GithubUser.insert({
        username: profile.login,
        avatar: profile.avatar_url,
        email: profile.email
      });
    }

    const payload = jwt.sign(user.toJson(), process.env.JWT_SECRET, { expiresIn: '1d' });

    res
      .cookie(process.env.COOKIE_NAME, payload, {
        httpOnly: true,
        maxAge: ONE_DAY_IN_MS
      })
      .redirect('/api/v1/posts');

  })

  .delete('/', async (req, res) => {
    res
      .clearCookie(process.env.COOKIE_NAME)
      .json({ success: true, message: 'You have signed out' });
  });
