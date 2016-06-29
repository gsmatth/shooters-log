'use strict';

const debug = require('debug')('shooter:rifle-controller');
const httpErrors = require('http-errors');

const Rifle = require('../model/rifle-model');

exports.createRifle = function(rifleInfo) {
  debug('create-rifle-controller');
  return new Promise((resolve, reject) => {
    new Rifle(rifleInfo).save()
    .then(rifle => resolve(rifle))
    .catch(err => reject(httpErrors(404, err.message)));
  });
};

exports.getRifle = function(rifleid) {
  debug('get-rifle0controller');
  return new Promise((resolve, reject) => {
    Rifle.findOne({_id: rifleid})
    .then(rifle => {
      resolve(rifle);
    })
    .catch(err => reject(httpErrors(404, err.message)));
  });
};

exports.removeAllRifles = function(){
  return Rifle.remove({});
};
