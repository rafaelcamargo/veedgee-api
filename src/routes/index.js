const root = require('./root');
const events = require('./events');
const bulk = require('./bulk');

const _public = {};

_public.init = app => {
  root.init(app);
  events.init(app);
  bulk.init(app);
};

module.exports = _public;
