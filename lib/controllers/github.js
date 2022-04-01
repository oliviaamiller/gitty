const { Router } = require('express');
const jwt = require('jsonwebtoken');
const GithubUser = require('../models/GithubUser');
const ONE_DAY_IN_MS = 1000 * 60 * 60 * 24;
const { exchangeToken, fetchProfile } = require('../utils/github');

module.exports = Router()
  .get('/login', async (req, res) => {
    res.redirect(`https://github.com/login/oauth/authorize?client_id=${process.env.CLIENT_ID}&scope=user&redirect_uri=${process.env.REDIRECT_URI}`);
  })

  .get('/login/callback', async (req, res) => {
    const { code } = req.query;

    const token = await exchangeToken(code);

    const profile = await fetchProfile(token);

    let user = await GithubUser.getById(profile.login);

    if (!user) {
      user = await GithubUser.insert({
        username: profile.login,
        avatar: profile.avatar_url,
        email: profile.email
      });
    }

  });
