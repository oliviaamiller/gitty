const GithubUser = require('../models/GithubUser');
const { exchangeToken, fetchProfile } = require('../utils/github');

module.exports = class GithubUserService {

  static create(code) {

    let githubProfile;
    return exchangeToken(code)
      .then((token) => fetchProfile(token))
      .then((profile) => {
        githubProfile = profile;
        return GithubUser.getByUsername(profile.username);
      })
      .then((user) => {
        if (!user) {
          return GithubUser.insert(githubProfile);
        } else return user;
      });

  }
};
