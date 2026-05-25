const eventsController = require('../controllers/events');
const { isPermitted } = require('../services/permission');

const _public = {};

_public.init = app => {
  app.post('/bulk/events', isPermitted, eventsController.bulkSave);
};

module.exports = _public;
