'use strict';

const debug = require('debug')('shooter:test-load-router');
const Router = require('express').Router;
const jsonParser = require('body-parser').json();

const testLoadController = require('../controller/test-load-controller');
const parseBearerAuth = require('../lib/parse-bearer-auth');

const testLoadRouter = module.exports = new Router();

testLoadRouter.post('/user/load/testload', parseBearerAuth, jsonParser, function(req, res, next){
  debug('test-load-post-route');
  testLoadController.createTestLoad(req.body)
  .then(testLoad => res.json(testLoad))
  .catch(next);
});

testLoadRouter.get('/user/load/testload/:testloadid', parseBearerAuth, jsonParser, function(req, res, next){
  debug('test-load-get-route');
  testLoadController.fetchTestLoad(req.body)
  .then(testLoad => res.json(testLoad))
  .catch(next);
});

testLoadRouter.put('/user/load/testload/:testloadid', parseBearerAuth, jsonParser, function(req, res, next){
  debug('test-load-put-route');
  testLoadController.updateTestLoad(req.params.testloadid)
  .then(testLoad => res.json(testLoad))
  .catch(next);
});

testLoadRouter.delete('/user/load/testload/:testloadid', parseBearerAuth, jsonParser, function(req, res, next){
  debug('test-load-delete-route');
  testLoadController.deleteTestLoad(req.params.testloadid)
  .then(() => res.status(204).send())
  .catch(next);
});
