'use strict';

const debug = require('debug')('shooter:score-controller');
const httpErrors = require('http-errors');
const Score = require('../model/socre-model');

exports.createScore = function(scoreData){
  debug('entered createScore function in score-controller.js');
  return new Promise ((resolve, reject) => {
    new Score(scoreData).save()
    .then score => resolve (score)
    .catch(err => reject(httpErrors(400, err.message)));
  });
};

exports.getScore = function(scoreId){
  debug('entered getScore function in score-controller.js');
  return new Promise((resolve, reject) => {
    score.findOne({_id: scoreId})
    .then(score => resolve(score))
    .catch(err => reject(httpErrors(404, err.message)));
  });
};

exports.deleteScore = function(scoreId){
  debug('entered deleteScore function in score-controller.js');
  return new Promise((resolve, reject) => {
    score.remove({_id: scoreId})
    .then(resolve)
    .catch(err => reject(httpErrors(404, err,message)));
  });

};

exports.removeAllScores = function(){
  return score.remove({});
}
