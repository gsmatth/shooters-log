'use strict';

const debug = ('debug')('shoot:competition-controlller');
const Competition = require('../model/competition-model');
// const handleErrors = require('../lib/handle-errors');


exports.getCompetition = function(id){
  debug('entered getCompetition in competition-controller');
  return new Promise((resolve, reject) => {
    Competition.findOne({_id: id})
    .then(competition => resolve(competition))
    .catch(reject);
  });
};
