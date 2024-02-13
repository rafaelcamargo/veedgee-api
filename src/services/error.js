const Rollbar = require('rollbar');
const projectPkg = require('../../package');
const environmentService = require('../services/environment');

const _public = {};

let rollbar;

_public.init = () => {
  const { ROLLBAR_TOKEN } = environmentService.get();
  if(ROLLBAR_TOKEN) {
    rollbar = new Rollbar({
      accessToken: ROLLBAR_TOKEN,
      captureUncaught: true,
      captureUnhandledRejections: true,
      payload: {
        code_version: projectPkg.version,
      }
    });
  }
};

_public.track = err => {
  if(rollbar) {
    console.error(err);
    rollbar.error(err);
  }
};

module.exports = _public;
