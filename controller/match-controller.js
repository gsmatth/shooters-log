'use strict';

const debug = require('debug')('shooter:matchController');
const Match = require('../model/match-model');
const Shot = require('../model/shot-model');
const competitionController = require('./competition-controller');
const httpErrors = require('http-errors');

exports.createMatch = function(competitionId, reqBody){
  debug('matchController: createMatch');
  return new Promise((resolve, reject) => {
    competitionController.getCompetition(competitionId)
    .then( (competition) => {
      if (!competition) {
        return reject(httpErrors(404, 'not found'));
      }
      if (!reqBody.matchNumber) {
        return reject(httpErrors(400, 'bad request'));
      }
      if (!reqBody.distanceToTarget) {
        return reject(httpErrors(400, 'bad request'));
      }
      return new Match(reqBody).save();
    })
    .then(resolve)
    .catch( err => reject(httpErrors(400, err.message)));
  });
};

exports.fetchMatch = function(id){
  debug('matchController: fetchMatch');
  return new Promise((resolve, reject) => {
    Match.findOne({_id: id})
    .then(match => {
      if(!match) {
        return reject(httpErrors(404, 'not found'));
      }
      resolve(match);
    })
    .catch(err => reject(httpErrors(404, err.message)));
  });
};

exports.updateMatch = function(id, reqBody){
  debug('matchController: updateMatch');
  return new Promise((resolve, reject) => {
    Match.findOne({_id: id})
    .then(match => {
      if(!match) {
        return reject(httpErrors(404, 'not found'));
      }
      if(!reqBody) {
        return reject(httpErrors(400, 'bad request'));
      }
      if(reqBody.matchNumber){
        var newNumber = reqBody.matchNumber;
        match.matchNumber = newNumber;
      }
      if(reqBody.targetNumber){
        var newTarget = reqBody.targetNumber;
        match.targetNumber = newTarget;
      }
      if(reqBody.distanceToTarget){
        var newDistance = reqBody.distanceToTarget;
        match.distanceToTarget = newDistance;
      }
      resolve(match);
    })
    .catch(err => reject(httpErrors(404, err.message)));
  });
};

exports.getAllMatchesByUserId = function(userId){
  return new Promise((resolve, reject) => {
    Match.find({userId: userId})
    .then(matches => {
      resolve(matches);
    })
    .catch(reject);
  });
};

exports.getAllShotsByMatchId = function(matchId){
  debug('match controller GET ALL SHOTS BY MATCH ID');
  return new Promise((resolve, reject) => {
    Match.findOne({_id: matchId})
    .then(match => {
      if(!match) {
        return reject(httpErrors(404, 'not found'));
      }
      return match._id;
    })
    .then(matchId => Shot.find({matchId}))
    .then(shot => {
      resolve(shot);
    }).catch(reject);
  });
};

exports.removeMatch = function(id){
  debug('matchController: removeMatch');
  return new Promise((resolve, reject) => {
    Match.findOne({_id: id})
    .then(match => {
      if(!match) {
        return reject(httpErrors(404, 'not found'));
      }
    }).then( Match.remove({_id: id}))
    .then(resolve)
    .catch(err => reject(httpErrors(404, err.message)));
  });
};

exports.removeAllMatches = function(){
  debug('matchController: removeAllMatches');
  return Match.remove({});
};
