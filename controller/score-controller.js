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
