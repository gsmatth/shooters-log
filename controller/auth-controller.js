'use strict';

const debug = require('debug')('shooter:authController');
const User = require('../model/user-model');
const Competition = require('../model/competition-model');
const httpErrors = require('http-errors');


exports.newUser = function(reqBody){
  debug('authController:newUser');
  return new Promise((resolve, reject) => {
    if(!reqBody.username || !reqBody.password)
      return reject(httpErrors(400, 'No username or password provided'));
    var password = reqBody.password;
    delete reqBody.password;
    var user = new User(reqBody);
    user.generateHash(password)
    .then(user => user.save())
    .then(user => user.generateToken())
    .then(token => resolve(token))
    .catch(reject);
  });
};

exports.getUser = function(userId) {
  debug('authcontroller:getUser');
  return new Promise((resolve, reject) => {
    if (!userId) return reject(httpErrors (400, 'no user ID given'));
    User.findOne({_id: userId})
    .then(user => {
      resolve(user);
    }).catch(reject);
  });
};

exports.updateUser = function(userId, reqBody){
  debug('authController:updateUser');
  return new Promise((resolve, reject) => {
    if(!userId)
      return reject(httpErrors(400, 'missing username'));
    if(!reqBody.nraNumber || reqBody.nraQualification)
      return reject(httpErrors(400, 'bad request'));
    User.findOne({_id: userId})
    .then(user => {
      if(reqBody.nraNumber){
        var newNRA = reqBody.nraNumber;
        user.nraNumber = newNRA;
      }
      if(reqBody.nraQualification){
        var newQual = reqBody.nraQualification;
        user.nraQualification = newQual;
      }
      return user.save();
    })
    .then(resolve)
    .catch(reject);
  });
};

exports.fetchCompsByUser = function(userId) {
  debug('authController:fetchCompsByUser');
  return new Promise((resolve, reject) => {
    Competition.find({userId: userId})
    .then(competition => {
      resolve(competition);
    })
    .catch(err => reject(httpErrors(404, err.message)));
  });
};

exports.removeAllUsers = function(){
  debug('authController:removeAllUsers');
  return User.remove({});
};

exports.signIn = function(auth) {
  debug('authController:signIn');
  return new Promise((resolve, reject) => {
    if(!auth.username || !auth.password)
      return reject(httpErrors(400, 'missing username or password'));
    User.findOne({username: auth.username})
    .then(user => user.compareHash(auth.password))
    .then(user => user.generateToken())
    .then(token => resolve(token))
    .catch(reject);
  });
};
