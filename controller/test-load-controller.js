'use strict';

const debug = require('debug')('shooter:test-load-controller');
const httpErrors = require('http-errors');

const testLoad = require('../model/test-load-model');

exports.createTestLoad = function(testLoadInfo){
  debug('test-load-controller-createTestLoad');
  return new Promise((resolve, reject) => {
    new testLoad(testLoadInfo).save()
    .then(testLoad => resolve(testLoad))
    .catch(err => reject(httpErrors(400, err.message)));
  });
};

exports.fetchTestLoad = function(testLoadId){
  debug('test-load-controller-fetchTestLoad');
  return new Promise((resolve, reject) => {
    testLoad.findOne({_id: testLoadId})
    .then(testLoad => resolve(testLoad))
    .catch(err => reject(httpErrors(404, err.message)));
  });
};

exports.fetchAllTestLoadsByLoad = function(loadId){
  debug('test-load-controller-fetchAll');
  return new Promise((resolve, reject) => {
    testLoad.find({loadId: loadId})
    .then(testLoads => {
      resolve(testLoads);
    })
    .catch(err => reject(httpErrors(404, err.message)));
  });
};

exports.updateTestLoad = function(testLoadId, testLoadInfo){
  debug('test-load-controller-updateTestLoad');
  return new Promise((resolve, reject) => {
    testLoad.findOneAndUpdate({_id: testLoadId}, {$set: testLoadInfo}, {new: true})
     .then(testLoad => {
       if(!testLoad) return reject(httpErrors(404, 'not found'));
       if(!testLoadInfo) {
         return reject(httpErrors(400, 'bad request'));
       }
       resolve(testLoad);
     })
     .catch(err => reject(httpErrors(404, err.message)));
  });
};

exports.deleteTestLoad = function(testLoadId){
  debug('test-load-controller-deleteTestLoad');
  return new Promise((resolve, reject) => {
    testLoad.remove({_id: testLoadId})
    .then(resolve)
    .catch(err => reject(httpErrors(404, err.message)));
  });
};

exports.removeAllTestLoads = function(){
  return testLoad.remove({});
};
