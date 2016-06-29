'use strict';

const debug = require('debug')('shooter:barrel-controlller');
const httpErrors = require('http-errors');
const Barrel = require('../model/barrel-model');

exports.createBarrel = function(barrelData){
  debug('entered createBarrel in barrel-controller.js');
  return new Promise((resolve, reject) => {
    new Barrel(barrelData).save()
    .then(barrel => resolve(barrel))
    .catch(err => reject(httpErrors(404, err.message)));
  });
};
