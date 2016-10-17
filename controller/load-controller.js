'use strict';

const debug = require('debug')('shooter:load-controller');
const httpErrors = require('http-errors');

const Load = require('../model/load-model');

exports.createLoad = function(loadInfo) {
  debug('create-load-controller');
  console.log(loadInfo);
  return new Promise((resolve, reject) => {
    new Load(loadInfo).save()
    .then(load => resolve(load))
    .catch(err => reject(httpErrors(400, err.message)));
  });
};

exports.getLoad = function(loadId) {
  debug('load-get-controller');
  return new Promise((resolve, reject) => {
    Load.findOne({_id: loadId})
    .then(load => resolve(load))
    .catch(err => reject(httpErrors(404, err.message)));
  });
};

exports.updateLoad = function(loadId, loadInfo) {
  debug('load-update-controller');
  return new Promise((resolve, reject) => {
    Load.findOneAndUpdate({_id: loadId}, {$set: loadInfo}, {new: true})
    .then(load => {
      if(!load) return reject(httpErrors(404, 'not found'));
      if(!loadInfo) {
        return reject(httpErrors(400, 'bad request'));
      }
      resolve(load);
    })
    .catch(err => reject(httpErrors(404, err.message)));
  });
};

exports.deleteLoad = function(loadId) {
  debug('delte-load-controller');
  return new Promise((resolve, reject) => {
    Load.remove({_id: loadId})
    .then(resolve)
    .catch(err => reject(httpErrors(404, err.message)));
  });
};

exports.removeAllLoads = function(){
  return Load.remove({});
};
