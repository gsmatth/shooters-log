'use strict';

// npm
const debug = require('debug')('shooter:rifle-router');
const Router = require('express').Router;
const jsonParser = require('body-parser').json();

// application
const loadController = require('../controller/load-controller');
const parseBearerAuth = require('../lib/parse-bearer-auth');

// global
const loadRouter = module.exports = new Router();

loadRouter.post('/user/:userid/load', parseBearerAuth, jsonParser, function(req, res, next) {
  debug('load-post-router');
  req.body.userId = req.params.userid;
  loadController.createLoad(req.body)
  .then(load => res.json(load))
  .catch(next);
});

loadRouter.get('user/:userid/load/:loadid', parseBearerAuth, jsonParser, function(req, res, next) {
  debug('load-get-route');
  req.body.userid = req.params.userid;
  req.body.loadid = req.params.loadid;
  loadController.getLoad(req.params.loadid)
  .then(load => res.json(load))
  .catch(next);
});

loadRouter.put('user/:userid/load/:loadid', parseBearerAuth, jsonParser, function(req, res, next) {
  debug('load-put-route');
  req.body.userid = req.params.userid;
  req.body.loadid = req.params.loadid;
  loadController.updateLoad(req.params.loadid, req.body)
  .then(load => res.json(load))
  .catch(next);
});

loadRouter.delete('user/:userid/load/:loadid', parseBearerAuth, jsonParser, function(req, res, next) {
  debug('load-delete-route');
  req.body.userid = req.params.userid;
  req.body.loadid = req.params.loadid;
  loadController.deleteLoad(req.params.loadid)
  .then(() => res.status(204).send())
  .catch(next);
});
