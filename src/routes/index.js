const root = require('./root');
const events = require('./events');

const _public = {};

_public.init = app => {
  root.init(app);
  events.init(app);
};

module.exports = _public;
