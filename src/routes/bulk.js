const eventsController = require('../controllers/events');
const { isPermitted } = require('../services/permission');

const _public = {};

_public.init = app => {
  app.post('/bulk/events', isPermitted, eventsController.bulkSave);
  app.patch('/bulk/events', isPermitted, eventsController.bulkUpdate);
};

module.exports = _public;
