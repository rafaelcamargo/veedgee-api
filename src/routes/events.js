const eventsController = require('../controllers/events');
const { isPermitted } = require('../services/permission');

const _public = {};

_public.init = app => {
  app.post('/events', isPermitted, eventsController.save);
  app.get('/events', eventsController.get);
};

module.exports = _public;

