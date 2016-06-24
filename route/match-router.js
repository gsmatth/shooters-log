'use strict';

const debug = require('debug')('shooter:matchRouter');
const Router = require('express').Router;
const jsonParser = require('body-parser').json();
const matchController = require('../controller/match-controller');
const parseBearerAuth = require('../lib/parse-bearer-auth');

const matchRouter = module.exports = new Router();

matchRouter.post('/competition/:competitionId/match', jsonParser, parseBearerAuth, function(req, res, next){
  debug('match router POST');
  req.body.userId         = req.userId;
  req.body.competitionId  = req.params.competitionId;
  matchController.createMatch(req.params.competitionId, req.body)
  .then(match => res.json(match))
  .catch(next);
});

matchRouter.get('/competition/:competitionId/match/:matchId', jsonParser, parseBearerAuth, function(req, res, next){
  debug('match router GET');
  req.body.userId = req.userId;
  matchController.fetchMatch(req.params.matchId)
  .then(match => res.json(match))
  .catch(next);
});

matchRouter.put('/competition/:competitionId/match/:matchId', jsonParser, parseBearerAuth, function(req, res, next){
  debug('match router UPDATE');
  matchController.updateMatch(req.params.matchId, req.body)
  .then(match => res.json(match))
  .catch(next);
});

matchRouter.delete('/competition/:competitionId/match/:matchId', jsonParser, parseBearerAuth, function(req, res, next){
  debug('match router DELETE');
  req.body.userId = req.userId;
  matchController.removeMatch(req.params.matchId)
  .then(() => {
    res.status(204).send();
  }).catch(next);
});
