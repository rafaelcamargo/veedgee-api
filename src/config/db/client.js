const { Client } = require('pg');
const ENV = require('../../services/environment')();

const _public = {};

_public.config = {
  database: ENV.DB.NAME,
  username: ENV.DB.USER,
  password: ENV.DB.PASS
};

_public.connect = async () => {
  const client = new Client({
    database: 'postgres',
    user: process.env.USER,
    password: null,
    host: 'localhost'
  });
  await client.connect();
  return client;
};

module.exports = _public;
