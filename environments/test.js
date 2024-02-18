const developement = require('./development');

module.exports = {
  ...developement,
  DB: {
    PROVIDER: 'postgresql',
    HOST: 'localhost',
    PORT: '5432',
    NAME: 'veedgee_test',
    USER: 'veedgee_test',
    PASS: null
  }
}
