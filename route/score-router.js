'use strict';

const Router = require('express').Router;
const debug = require('debug')('shooter:score-router');

const scoreController = require('../controller/score-controller');
const parseBearerAuth = require('../lib/parse-bearer-auth');

const scoreRouter = module.exports = new Router();
const jsonParser = require('body-parser').json();

scoreRouter.get('/competition/:id/match/:id/score/:id', function(req, res, next){
  debug('entered scoreRouter.get route');
  scoreController.getScore(req.params.id)
  .then(score => res.send(score))
  .catch(next);
});

scoreRouter.post('/competition/:id/match/:id/score/', parseBearerAuth, jsonParser, function(req, res, next){
  debug('entered scoreRouter.post route');
  req.body.scoreId = req.scoreId;
  scoreController.scoreCompetition(req.body)
  .then( score => res.json(score))
  .catch(next);
});
