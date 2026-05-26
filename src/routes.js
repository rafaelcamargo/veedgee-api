const routes = require('./routes/');

const _public = {};

_public.appendRoutes = app => {
  routes.init(app);
  return app;
};

module.exports = _public;
