const eventsController = require('../controllers/events');

const _public = {};

_public.init = app => {
  app.post('/events', eventsController.save);
  app.get('/events', eventsController.get);
};

module.exports = _public;

