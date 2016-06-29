'use strict';

const debug = require('debug')('shooter:score-card-controlller');
const Competition = require('../model/competition-model');
const httpErrors = require('http-errors');
const Match = require('../model/match-model');
const competitionController = require('../controller/competition-controller');
const matchController = require('../controller/match-controller');
const shotController = require('../controller/shot-controller');

exports.fillScoreCard = function(compId){
  debug('score-card-controller: fillScoreCard')
  return new Promise.all([competitionController.getCompetition(compId), competitionController.getAllMatchesByCompetitionId(compId)])
    .then(values => {

      resolve(values)})
    .catch(reject);
};
