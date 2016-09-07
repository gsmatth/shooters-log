'use strict';

const Router = require('express').Router;
const debug = require('debug')('shooter:userRouter');
const parseBearerAuth = require('../lib/parse-bearer-auth');
const competitionController = require('../controller/competition-controller');
const matchController = require('../controller/match-controller');

const scorecardRouter = module.exports = new Router();



scorecardRouter.get('/scorecard/:competitionId', parseBearerAuth, function(req, res, next){
  debug('entered scorecardRouter.get route');
  const ScoreCard = {};
  
  competitionController.getCompetition(req.params.competitionId)
  .then(competition => {
    debug('COMPETITION: \n', competition);
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
    res.json(ScoreCard);
  })
  .catch(next);
});
