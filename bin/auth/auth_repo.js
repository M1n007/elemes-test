const config = require('../configs/globalConfigs');

class User {
  constructor(username, password) {
    this.username = username;
    this.password = password;
  }

  isValidPassword(password) {
    return this.password === password;
  }
}

const findByUsername = (username, cb) => {
  const userDatas = config.get('/basicAuthApi');
  let userData;

  userData = userDatas.map((value) => {
    if (value.username === username) {
      return value;
    }
    return '';
  });
  const user = new User(userData[0].username, userData[0].password);
  cb(user);
};

const findByApiKey = (apiKey, cb) => {
  const apiKeyData = config.get('/').apiKey

  let result;
  result = apiKeyData === apiKey;
  cb(result);
};

module.exports = {
  findByUsername,
  findByApiKey
}
