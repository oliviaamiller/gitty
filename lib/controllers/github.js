const { Router } = require('express');
const jwt = require('jsonwebtoken');
const ONE_DAY_IN_MS = 1000 * 60 * 60 * 24;
const GithubUser = require('../models/GithubUser');
const { exchangeToken, fetchProfile } = require('../utils/github');



module.exports = Router()
  .get('/login', (req, res) => {
    res.redirect(`https://github.com/login/oauth/authorize?client_id=${process.env.CLIENT_ID}&scope=user&redirect_uri=${process.env.REDIRECT_URI}`);
  })

  .get('/login/callback', (req, res) => {
    const { code } = req.query;

    let profile;
  
    return exchangeToken(code)
      .then((token) => fetchProfile(token))
      .then(({ username, email }) => {
        profile = { username, email };
        return GithubUser.getByUsername(username);
      })
      .then((user) => {
        if (!user) {
          return GithubUser.insert(profile);
        } else {
          return user;
        }
      })
      .then((user) => {
        const payload = jwt.sign({ ...user }, process.env.JWT_SECRET, {
          expiresIn: '1d'
        });

        res
          .cookie(process.env.COOKIE_NAME, payload, {
            httpOnly: true,
            maxAge: ONE_DAY_IN_MS
          })
          .redirect('/api/v1/posts');
      });

    

    // const token = await exchangeToken(code);

    // const profile = await fetchProfile(token);

    // let user = await GithubUser.getByUsername(profile.login);

    // if (!user) {
    //   user = await GithubUser.insert({
    //     username: profile.login,
    //     avatar: profile.avatar_url,
    //     email: profile.email
    //   });
    // }

    // const payload = jwt.sign(user.toJson(), process.env.JWT_SECRET, { expiresIn: '1d' });

    // res
    //   .cookie(process.env.COOKIE_NAME, payload, {
    //     httpOnly: true,
    //     maxAge: ONE_DAY_IN_MS
    //   })
    //   .redirect('/api/v1/posts');

  })

  .delete('/', (req, res) => {
    res
      .clearCookie(process.env.COOKIE_NAME)
      .json({ success: true, message: 'You have signed out' });
  });
