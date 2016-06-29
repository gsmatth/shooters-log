'use strict';

const Router = require('express').Router;
const debug = require('debug')('shooter:score-card-router');
const competitionController = require('../controller/competition-controller');
const parseBearerAuth = require('../lib/parse-bearer-auth');
const jsonParser = require('body-parser').json();
const httpErrors = require('http-errors');
const matchController = require('../controller/match-controller');
const scoreCardController = require('../controller/score-card-controller');

const scoreCardRouter = module.exports = new Router();

scoreCardRouter.get(`/competition/:id/all`, parseBearerAuth, function(req, res, next){
  debug('ScoreCardRouter.get route');
  scoreCardController.fillScoreCard(req.params.id)
  .then( values => {
    if(!values){
      return next(httpErrors(404, 'competition not found'));
    }
    resolve(values);
  }).catch(next);
});
