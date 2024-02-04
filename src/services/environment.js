const PRODUCTION = require('../../environments/production');
const TEST = require('../../environments/test');
const DEV = require('../../environments/development');

module.exports = function(){
  return {
    'test': TEST,
    'production': PRODUCTION
  }[process.env.NODE_ENV] || DEV;
};
