module.exports = {
  DB: {
    PROVIDER: 'postgresql',
    HOST: process.env.VEEDGEE_DB_HOST,
    PORT: process.env.VEEDGEE_DB_PORT,
    NAME: process.env.VEEDGEE_DB_NAME,
    USER: process.env.VEEDGEE_DB_USER,
    PASS: process.env.VEEDGEE_DB_PASS
  },
  BUGSNAG_API_TOKEN: process.env.BUGSNAG_API_TOKEN,
  VEEDGEE: {
    API_TOKENS: process.env.VEEDGEE_API_TOKENS
  }
}
