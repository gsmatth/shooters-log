'use strict';

const debug = require('debug')('shooter:matchRouter');
const Router = require('express').Router;
const jsonParser = require('body-parser').json();
const matchController = require('../controller/match-controller');
const parseBearerAuth = require('../lib/parse-bearer-auth');

const matchRouter = module.exports = new Router();

matchRouter.post('/competition/:id/match', jsonParser, parseBearerAuth, function(req, res, next){
  debug('match router POST');
  req.body.userId = userId;
  matchController.createMatch(req.body)
  .then(match => res.json(match))
  .catch(next);
});

matchRouter.get('/competition/:id/match/:id', jsonParser, parseBearerAuth, function(req, res, next){
  debug('match router GET');
  req.body.userId = userId;
  matchController.fetchMatch(req.params.id)
  .then(match => res.json(match))
  .catch(next);
});
