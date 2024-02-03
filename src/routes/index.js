const root = require('./root');

const _public = {};

_public.init = app => {
  root.init(app);
};

module.exports = _public;
