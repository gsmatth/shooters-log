'use strict';

const debug = require('debug')('shooter:parse-bearer-auth');
const httpErrors = require('http-errors');
const jwt = require('jsonwebtoken');

const User = require('../model/user-model');

module.exports = function(req, res, next){
  debug('parseBearerAuth');
  if(!req.headers.authorization)
    return next(httpErrors(401, 'requires authorization header'));
  const token = req.headers.authorization.split(' ')[1];
  jwt.verify(token, process.env.APP_SECRET, function(err, decoded){
    if(err)
      return next(httpErrors(401, err.message));
    User.findOne({findHash: decoded.token})
    .then( user => {
      req.userId = user._id;
      console.log('parse-bearer-auth user._id', user._id);
      next();
    })
    .catch(err => {
      next(httpErrors(401, err.message));
    });
  });
};
