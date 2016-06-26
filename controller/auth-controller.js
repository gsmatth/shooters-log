'use strict';

const debug = require('debug')('shooter:authController');
const User = require('../model/user-model');
const httpErrors = require('http-errors');


exports.newUser = function(reqBody){
  debug('authController:newUser');
  return new Promise((resolve, reject) => {
    if(!reqBody.username || !reqBody.password)
      return reject(httpErrors(404, 'No username or password provided'));
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

exports.updateUser = function(userId, reqBody){
  debug('authController:updateUser');
  console.log('updateUser passed:', userId, reqBody);
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

exports.removeAllUsers = function(){
  debug('authController:removeAllUsers');
  return User.remove({});
};

exports.signIn = function(auth) {
  debug('authController:signIn');
  console.log('auth: ', auth);
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
