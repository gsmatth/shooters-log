'use strict';

const Router = require('express').Router;
const debug = require('debug')('shooter:competition-router');
const competitionController = require('../controller/competition-controller');
//do we need to authenticate token for each route?
const competitionRouter = module.exports = new Router();

competitionRouter.get('/competition/:id', function(req, res, next){
  debug('entered competitionRouter.get route');
  competitionController.getCompetition(req.params.id)
  .then(competition => res.send(competition))
  .catch(next);
});
