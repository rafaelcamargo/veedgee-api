const { dbClient, handleTransaction } = require('../services/database');

const _public = {};

_public.save = (req, res) => handleTransaction(
  () => dbClient.events.create({ data: req.body }),
  () => res.status(201).send(),
  res
);

_public.get = (req, res) => handleTransaction(
  () => dbClient.events.findMany({ where: { slug: req.params.slug } }),
  data => res.status(200).send(data),
  res
);

module.exports = _public;
