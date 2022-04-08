const fetch = require('cross-fetch');

const exchangeToken = (code) => {
  fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      code
    })
  })
    .then((tokenRes) => {
      return tokenRes.json();
    });
};

const fetchProfile = (token) => {
  fetch('https://api.github.com/user', {
    headers: {
      Authorization: `token ${token}`
    }
  })
    .then((profileRes) => {
      return profileRes.json();
    })
    .then((profile) => {
      const newProfile = {
        username: profile.login,
        email: profile.email,
        avatar: profile.avatar_url
      };
      return newProfile;
    });
};

module.exports = { exchangeToken, fetchProfile };
