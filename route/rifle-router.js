'use strict';

// npm
const debug = require('debug')('shooter:rifle-router');
const Router = require('express').Router;
const jsonParser = require('body-parser').json();

// application
const rifleController = require('../controller/rifle-controller');
const parseBearerAuth = require('../lib/parse-bearer-auth');

// global
const rifleRouter = module.exports = new Router();

rifleRouter.post('/user/:userid/rifle/', parseBearerAuth, jsonParser, function(req, res, next) {
  debug('rifle-post-route');
  req.body.userId = req.params.userid;
  rifleController.createRifle(req.body)
  .then(rifle => res.json(rifle))
  .catch(next);
});

rifleRouter.get('/user/:userid/rifle/:rifleid', parseBearerAuth, jsonParser, function(req, res, next) {
  debug('rifle-post-route');
  req.body.userid = req.params.userid;
  req.body.rifleid = req.params.rifleid;
  rifleController.getRifle(req.params.rifleid)
  .then(match => res.json(match))
  .catch(next);
});
