const request = require('supertest');
const { dbClient } = require('../services/database');
const app = require('../app');

const _public = {};

_public.serve = () => request(app);

_public.pause = timeout => new Promise(resolve => setTimeout(resolve, timeout));

_public.clearDbTable = async tableName => await dbClient[tableName].deleteMany({});

module.exports = _public;
