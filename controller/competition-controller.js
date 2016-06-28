'use strict';

const debug = require('debug')('shooter:competition-controlller');
const Competition = require('../model/competition-model');
const httpErrors = require('http-errors');
const Match = require('../model/match-model');


exports.createCompetition = function(competitionData){
  debug('createCompetition');
  return new Promise((resolve, reject) => {
    new Competition(competitionData).save()
    .then(competition => resolve(competition))
    .catch( err => reject(httpErrors(400, err.message)));
  });
};


exports.getCompetition = function(id){
  debug('entered getCompetition in competition-controller');
  return new Promise((resolve, reject) => {
    Competition.findOne({_id: id})
    .then(competition => {
      resolve(competition);
    })
    .catch(err => reject(httpErrors(404, err.message)));
  });
};

exports.updateCompetition = function(id, reqbody){
  return new Promise((resolve, reject) => {
    if(JSON.stringify(reqbody) === '{}') return reject(httpErrors(400, 'need to provide a body'));
    Competition.findOne({_id: id})
    .then(competition => {
      competition.location = reqbody.location;
      competition.action = reqbody.action;
      competition.save();
      resolve(competition);
    }).catch(err => reject(httpErrors(404, err.message)));
  });
};

exports.deleteCompetition = function(competitionId){
  return new Promise((resolve, reject) => {
    Competition.remove({_id:competitionId})
    .then(resolve)
    .catch(err => reject(httpErrors(404, err.message)));
  });
};

exports.removeAllCompetition = function(){
  return Competition.remove({});
};

exports.getAllMatchesByCompetitionId = function(competitionId){
  return new Promise((resolve, reject) => {
    Match.find({competitionId: competitionId})
    .then(matches => {
      resolve(matches);
    })
  .catch(reject);
  });
};
