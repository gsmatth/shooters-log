'use strict';

const debug = require('debug')('shooter:score-controller');
const httpErrors = require('http-errors');
const Score = require('../model/score-model');

exports.createScore = function(scoreData){
  debug('entered createScore function in score-controller.js');
  return new Promise ((resolve, reject) => {
    new Score(scoreData).save()
    .then (score => resolve (score))
    .catch(err => reject(httpErrors(400, err.message)));
  });
};

exports.getScore = function(scoreId){
  debug('entered getScore method in score-controller.js');
  return new Promise((resolve, reject) => {
    Score.findOne({_id: scoreId})
    .then(score => resolve(score))
    .catch(err => reject(httpErrors(404, err.message)));
  });
};

exports.deleteScore = function(scoreId){
  debug('entered deleteScore method in score-controller.js');
  return new Promise((resolve, reject) => {
    Score.remove({_id: scoreId})
    .then(resolve)
    .catch(err => reject(httpErrors(404, err.message)));
  });

};

exports.putScore = function(scoreId, scoreData){
  debug('entered putScore method in score-controller.js');
  return new Promise((resolve, reject) => {
    Score.findOneAndUpdate({_id: scoreId}, scoreData, {new:true})
    .then(resolve)
    .catch(err => reject(httpErrors(404, err.message)));
  });
};

exports.removeAllScores = function(){
  debug('entered removeAllScores in score-controller.js');
  return Score.remove({});
};
