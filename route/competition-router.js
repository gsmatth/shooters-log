'use strict';

const Router = require('express').Router;
const debug = require('debug')('shooter:competition-router');
const competitionController = require('../controller/competition-controller');
const parseBearerAuth = require('../lib/parse-bearer-auth');
//do we need to authenticate token for each route?
const competitionRouter = module.exports = new Router();
const jsonParser = require('body-parser').json();

competitionRouter.get('/competition/:id', function(req, res, next){
  debug('entered competitionRouter.get route');
  competitionController.getCompetition(req.params.id)
  .then(competition => res.send(competition))
  .catch(next);
});

competitionRouter.post('/competition', parseBearerAuth, jsonParser, function(req, res, next){
  debug('POST /api/competition');
  req.body.userId = req.userId;
  competitionController.createCompetition(req.body)
  .then( competition => res.json(competition))
  .catch(next);
});
