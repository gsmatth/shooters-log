'use strict';

const debug = require('debug')('shooter:rifle-controller');
const httpErrors = require('http-errors');

const Rifle = require('../model/rifle-model');

exports.createRifle = function(rifleInfo) {
  debug('create-rifle-controller');
  return new Promise((resolve, reject) => {
    new Rifle(rifleInfo).save()
    .then(rifle => resolve(rifle))
    .catch(err => reject(httpErrors(400, err.message)));
  });
};

exports.getRifle = function(rifleid) {
  debug('get-rifle-controller');
  return new Promise((resolve, reject) => {
    Rifle.findOne({_id: rifleid})
    .then(rifle => {
      resolve(rifle);
    })
    .catch(err => reject(httpErrors(404, err.message)));
  });
};

exports.updateRifle = function(rifleid, rifleInfo) {
  debug('rifle-update-controller');
  return new Promise((resolve, reject) => {
    Rifle.findOneAndUpdate({_id: rifleid}, {$set: rifleInfo}, {new: true})
    .then(rifle => {
      if(!rifle) return reject(httpErrors(404, 'not found'));
      if(!rifleInfo.rifleName && !rifleInfo.rifleCategory && !rifleInfo.rifleAction) {
        return reject(httpErrors(400, 'bad request'));
      }
      resolve(rifle);
    })
    .catch(err => reject(httpErrors(404, err.message)));
  });
};

exports.deleteRifle = function(rifleid) {
  debug('delete-rifle-controller');
  return new Promise((resolve, reject) => {
    Rifle.remove({_id: rifleid})
    .then(resolve)
    .catch(err => reject(httpErrors(404, err.message)));
  });
};

exports.removeAllRifles = function(){
  return Rifle.remove({});
};
