'use strict';

const debug = require('debug')('shooter:matchController');
const Match = require('../model/match-model');
const competitionController = require('./competition-controller');
const httpErrors = require('http-errors');

exports.createMatch = function(competitionId, reqBody){
  debug('matchController: createMatch');
  return new Promise((resolve, reject) => {
    competitionController.getCompetition(competitionId)
    .then( () => {
      return new Match(reqBody).save();
    })
    .catch( err => reject(httpErrors(400, err.message)))
    .then(resolve)
    .catch( err => reject(httpErrors(404, err.message)));
  });
};

exports.fetchMatch = function(id){
  debug('matchController: fetchMatch');
  return new Promise((resolve, reject) => {
    Match.findOne({_id: id})
    .then(match => resolve(match))
    .catch(err => reject(httpErrors(404, err.message)));
  });
};

exports.removeMatch = function(id){
  debug('matchController: removeMatch');
  return new Promise((resolve, reject) => {
    Match.remove({_id: id})
    .then(resolve)
    .catch(err => reject(httpErrors(404, err.message)));
  });
};

exports.removeAllMatches = function(){
  debug('matchController: removeAllMatches');
  return Match.remove({});
};
