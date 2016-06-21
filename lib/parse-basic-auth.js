'use strict';

const httpErrors = require('http-errors');
const debug = require('debug')('shooter:parse-basic-auth');

module.exports = function(req, res, next){
  debug('parse-basic-auth');
  if(!req.headers.authorization){
    return next(httpErrors(401, 'requires authorization header'));
  }
  var authHeader = req.headers.authorization;
  var namePassword = authHeader.split(' ')[1];
  namePassword = new Buffer(namePassword, 'base64').toString('utf8');
  namePassword = namePassword.split(':');
  req.auth = {
    usename: namePassword[0]
    , password: namePassword[1]
  };
  if(!req.auth.username) {
    return next(httpErrors(401, 'no username provided'));

  }
  if(!req.auth.password) {
    return next(httpErrors(401, 'no password provided'));
  }
  next();
};
