/* eslint-disable no-console */
const exchangeToken = async (code) => {
  console.log(`MOCK INVOKED: exchangeToken(${code})`);
  return `MOCK_TOKEN_FOR_CODE_${code}`;
};
  
const fetchProfile = async (token) => {
  console.log(`MOCK INVOKED: fetchProfile(${token})`);
  return {
    login: 'Ernie',
    avatar_url: 'https://www.placecage.com/gif/300/300',
    email: 'meow@meow.meow',
  };
};
  
module.exports = { exchangeToken, fetchProfile };
