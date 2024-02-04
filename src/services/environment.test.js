const PRODUCTION = require('../../environments/production');
const TEST = require('../../environments/test');
const DEV = require('../../environments/development');

describe('Environment', () => {
  it('should export production environment if production env argument is given', () => {
    process.env.NODE_ENV = 'production';
    const ENV = require('./environment')();
    expect(ENV).toEqual(PRODUCTION);
  });

  it('should export test environment if test env argument is given', () => {
    process.env.NODE_ENV = 'test';
    const ENV = require('./environment')();
    expect(ENV).toEqual(TEST);
  });

  it('should export development environment if no env argument is given', () => {
    process.env.NODE_ENV = '';
    const ENV = require('./environment')();
    expect(ENV).toEqual(DEV);
  });
});
