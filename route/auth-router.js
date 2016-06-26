'use strict';

const Router = require('express').Router;
const jsonParser = require('body-parser').json();
const debug = require('debug')('shooter:sigupRouter');
const authController = require('../controller/auth-controller');
const parseBasicAuth = require('../lib/parse-basic-auth');
const parseBearerAuth = require('../lib/parse-bearer-auth');

const authRouter = module.exports = new Router();

authRouter.post('/signup', jsonParser, function(req, res, next){
  debug('post api/signup');
  authController.newUser(req.body)
  .then((token) => res.send(token))
  .catch(next);
});

authRouter.get('/signin', parseBasicAuth, function(req, res, next){
  authController.signIn(req.auth)
  .then(token => res.send(token))
  .catch(next);
});
