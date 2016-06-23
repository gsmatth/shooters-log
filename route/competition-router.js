'use strict';

const Router = require('express').Router;
const debug = require('debug')('shooter:competition-router');
const competitionController = require('../controller/competition-controller');
const parseBearerAuth = require('../lib/parse-bearer-auth');
//do we need to authenticate token for each route?
const competitionRouter = module.exports = new Router();
const jsonParser = require('body-parser').json();
const httpErrors = require('http-errors');

competitionRouter.get('/competition/:id', parseBearerAuth, function(req, res, next){
  debug('entered competitionRouter.get route');
  competitionController.getCompetition(req.params.id)
  .then(competition => {
    if(!competition){
      return next(httpErrors(404, 'competition not found'));
    }
    res.json(competition);
  }).catch(next);
});

competitionRouter.post('/competition', parseBearerAuth, jsonParser, function(req, res, next){
  debug('POST /api/competition');
  req.body.userId = req.userId;
  competitionController.createCompetition(req.body)
  .then( competition => res.json(competition))
  .catch(next);
});

competitionRouter.get('/competition', (req, res, next) => {
  next(httpErrors(400, 'no competition id provided'));
});

competitionRouter.put('/competition/:id', parseBearerAuth, jsonParser, function(req, res, next){
  competitionController.updateCompetition(req.params.id, req.body)
  .then(competition => {
    if(!competition) return next(httpErrors(404, 'talent not found'));
    res.json(competition);
  })
  .catch(next);
});

competitionRouter.delete('/competition/:id', parseBearerAuth, function(req, res, next){
  competitionController.deleteCompetition(req.params.id)
  .then(() => {
    res.status(204).send();
  }).catch(next);
});
