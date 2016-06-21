'use strict';

const Router = require('express').Router;
const jsonParser = require('body-parser').json();
const debug = require('debug')('shooter:sigupRouter');
const authController = require('../controller/auth-controller');

const signUpRoute = module.exports = new Router();

signUpRoute.post('/signup', jsonParser, function(req, res, next){
  debug('post api/signup');
  authController.newUser(req.body)
  .then((token) => res.send(token))
  .catch(next);
});
