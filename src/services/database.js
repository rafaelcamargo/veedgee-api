const { PrismaClient } = require('@prisma/client');
const errorService = require('./error');

const _public = {};

_public.dbClient = new PrismaClient();

_public.handleTransaction = (request, onSuccess, res) => {
  request()
    .then(data => onSuccess(data))
    .catch(err => {
      errorService.track(err);
      res.status(500).send(err);
    });
};

module.exports = _public;
