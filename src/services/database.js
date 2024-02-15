const { Pool, neonConfig } = require('@neondatabase/serverless');
const { PrismaNeon } = require('@prisma/adapter-neon');
const { PrismaClient } = require('@prisma/client');
const ws = require('ws');
const errorService = require('./error');

const _public = {};

_public.dbClient = buildDbClient();

_public.handleTransaction = (request, onSuccess, res) => {
  request()
    .then(data => onSuccess(data))
    .catch(err => {
      errorService.track(err);
      res.status(500).send(err);
    });
};

function buildDbClient(){
  return {
    'production': buildProdDbClient()
  }[process.env.NODE_ENV] || buildDefaultDbClient();
}

function buildDefaultDbClient(){
  return new PrismaClient();
}

function buildProdDbClient(){
  neonConfig.webSocketConstructor = ws;
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const adapter = new PrismaNeon(pool);
  return new PrismaClient({ adapter });
}

module.exports = _public;
