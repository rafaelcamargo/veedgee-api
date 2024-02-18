const ENV = require('./environment').get();

const _public = {};

_public.isPermitted = (req, res, next) => {
  return hasPermissionToken(req) ? next() : res.status(401).send();
};

function hasPermissionToken({ headers }){
  return ENV.VEEDGEE.API_TOKENS.split(',').includes(headers.vatoken);
}

module.exports = _public;
