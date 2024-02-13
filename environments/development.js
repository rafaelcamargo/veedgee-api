module.exports = {
  DB: {
    PROVIDER: 'postgresql',
    HOST: 'localhost',
    PORT: '5432',
    NAME: 'veedgee_dev',
    USER: 'veedgee_dev',
    PASS: null
  },
  ROLLBAR_TOKEN: process.env.VEEDGEE_API_ROLLBAR_TOKEN
}
