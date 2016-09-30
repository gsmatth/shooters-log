'use strict';

const debug = require('debug')('shooter:user');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const httpErrors = require('http-errors');

const userSchema = module.exports = mongoose.Schema({
  username:         {type: String, required: true, unique: true},
  password:         {type: String, required: true},
  findHash:         {type: String, unique: true},
  nraNumber:        {type: Number},
  nraQualification: {type: String},
  emailAddress:     {type: String, unique: true},
  firstName: {type: String, required: true},
  lastName: {type: String, required: true},
  nameSuffix: {type: String}
});

userSchema.methods.generateHash = function(password){
  debug('generateHash');
  return new Promise((resolve, reject) => {
    bcrypt.hash(password, 9, (err, hash) => {
      this.password = hash;
      resolve(this);
      reject(err);
    });
  });
};

userSchema.methods.compareHash = function(password){
  debug('compareHash');
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, this.password, (err, result) => {
      if(err) return reject(err);
      if(!result) return reject(httpErrors(401, 'wrong password'));
      resolve(this);
    });
  });
};

userSchema.methods.generateFindHash = function(){
  debug('generateFindHash');
  return new Promise((resolve, reject) => {
    var tries = 0;
    _generateFindHash.call(this);

    function _generateFindHash(){
      this.findHash = crypto.randomBytes(32).toString('hex');
      this.save()
      .then(() => resolve(this.findHash))
      .catch((err) => {
        if(tries > 5) reject(err);
        tries ++;
        _generateFindHash.call(this);
      });
    }
  });
};

userSchema.methods.generateToken = function() {
  debug('generateToken');
  return new Promise((resolve, reject) => {
    this.generateFindHash()
    .then( findHash => resolve(jwt.sign({token: findHash, userId: this._id}, process.env.APP_SECRET)))
    .catch(reject);
  });
};

module.exports = mongoose.model('User', userSchema);
