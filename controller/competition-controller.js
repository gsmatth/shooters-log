'use strict';

const debug = require('debug')('shoot:competition-controlller');
const Competition = require('../model/competition-model');
const httpErrors = require('http-errors');
// const handleErrors = require('../lib/handle-errors');


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
    .then(competition => resolve(competition))
    .catch(reject);
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
