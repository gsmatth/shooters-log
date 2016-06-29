'use strict';

const debug = require('debug')('shooter:barrel-controlller');
const Barrel = require('../model/barrel-model');
const httpErrors = require('http-errors');

exports.createBarrel = function(barrelData){
  debug('entered createBarrel in barrel-controller.js');
  return new Promise((resolve, reject) => {
    new Barrel(barrelData).save()
    .then(barrel => resolve(barrel))
    .catch(err => httpErrors(400, err.message))
  });
};
