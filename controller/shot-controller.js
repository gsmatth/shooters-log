'use strict';

const debug = require('debug')('shooter:shot-controller');
const httpErrors = require('http-errors');
const Shot = require('../model/shot-model');

exports.createShot = function(shotData){
  debug('entered createShot function in shot-controller.js');
  return new Promise ((resolve, reject) => {
    new Shot(shotData).save()
    .then (shot => resolve (shot))
    .catch(err => reject(httpErrors(400, err.message)));
  });
};

exports.getShot = function(shotId){
  debug('entered getShot method in shot-controller.js');
  return new Promise((resolve, reject) => {
    Shot.findOne({_id: shotId})
    .then(shot => resolve(shot))
    .catch(err => reject(httpErrors(404, err.message)));
  });
};

exports.deleteShot = function(shotId){
  debug('entered deleteShot method in shot-controller.js');
  return new Promise((resolve, reject) => {
    Shot.remove({_id: shotId})
    .then(resolve)
    .catch(err => reject(httpErrors(404, err.message)));
  });

};

exports.putShot = function(shotId, shotData){
  debug('entered putShot method in shot-controller.js');
  return new Promise((resolve, reject) => {
    Shot.findOneAndUpdate({_id: shotId}, shotData, {new:true})
    .then(resolve)
    .catch(err => reject(httpErrors(404, err.message)));
  });
};

exports.removeAllShots = function(){
  debug('entered removeAllShots in shot-controller.js');
  return Shot.remove({});
};
