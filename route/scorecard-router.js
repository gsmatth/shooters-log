'use strict';

const Router = require('express').Router;
// const jsonParser = require('body-parser').json();
const debug = require('debug')('shooter:userRouter');
// const authController = require('../controller/auth-controller');
const parseBearerAuth = require('../lib/parse-bearer-auth');
const competitionController = require('../controller/competition-controller');
const matchController = require('../controller/match-controller');
// const shotController = require('../controller/shot-controller');
// const httpErrors = require('http-errors');

const scorecardRouter = module.exports = new Router();

const ScoreCard = new Object();

scorecardRouter.get('/scorecard/:competitionId', parseBearerAuth, function(req, res, next){
  debug('entered scorecardRouter.get route');
  competitionController.getCompetition(req.params.competitionId)
  .then(competition => {
    ScoreCard.competition = competition;
    return competitionController.getAllMatchesByCompetitionId(req.params.competitionId);
  })
  .then( matches => {
    ScoreCard.matches = matches;
    var populatedShotPromisesArray = ScoreCard.matches.map((matches) => {
      return matchController.getAllShotsByMatchId(matches._id);
    });
    return Promise.all(populatedShotPromisesArray);
  }).then((shots) => {
    ScoreCard.shots = shots;
    console.log('ScoreCard.shots', ScoreCard.shots);
    res.json(ScoreCard);
  })
  .catch(next);
});
