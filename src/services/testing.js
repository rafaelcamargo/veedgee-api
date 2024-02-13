const request = require('supertest');
const app = require('../app');

const _public = {};

_public.serve = () => request(app);

_public.pause = timeout => new Promise(resolve => setTimeout(resolve, timeout));

module.exports = _public;
