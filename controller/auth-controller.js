'use strict';

const debug = require('debug')('shooter:authController');
const User = require('../model/user-model');
const httpErrors = require('http-errors');

exports.newUser = function(reqBody){
  debug('authController:newUser');
  return new Promise((resolve, reject) => {
    if(!reqBody.username || !reqBody.password){
      return reject(httpErrors(400, 'No username or password provided'));
    }
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

exports.removeAllUsers = function(){
  debug('authController:removeAllUsers');
  return User.remove({});
};

exports.signIn = function(auth) {
  debug('authController:signIn');
  return new Promise((resolve, reject) => {
    User.findOne({username: auth.username})
    .then(user => user.compareHash(auth.password))
    .then(user => user.generateToken())
    .then(token => resolve(token))
    .catch(reject);
  });
};
