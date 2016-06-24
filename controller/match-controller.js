'use strict';

const debug = require('debug')('shooter:matchController');
const Match = require('../model/match-model');
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
      if(!reqBody.matchNumber) {
        return reject(httpErrors(400, 'bad request'));
      }
      var newNumber = reqBody.matchNumber;
      match.matchNumber = newNumber;
      resolve(match);
    })
    .catch(err => reject(httpErrors(404, err.message)));
  });
};

exports.removeMatch = function(id){
  debug('matchController: removeMatch');
  return new Promise((resolve, reject) => {
    console.log('DELETE ONE MATCH id =', id);
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
