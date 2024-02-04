module.exports = {
  DB: {
    PROVIDER: 'postgresql',
    HOST: process.env.VEEDGEE_DB_HOST,
    PORT: process.env.VEEDGEE_DB_PORT,
    NAME: process.env.VEEDGEE_DB_NAME,
    USER: process.env.VEEDGEE_DB_USER,
    PASS: process.env.VEEDGEE_DB_PASS,
  }
}
