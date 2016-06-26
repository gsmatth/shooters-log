'use strict';

const Router = require('express').Router;
const jsonParser = require('body-parser').json();
const debug = require('debug')('shooter:userRouter');
const authController = require('../controller/auth-controller');
const parseBearerAuth = require('../lib/parse-bearer-auth');

const userRouter = module.exports = new Router();

userRouter.put('/user', jsonParser, parseBearerAuth, function(req, res, next){
  debug('user PUT route');
  req.body.userId = req.userId;
  console.log('req.userId', req.userId);
  authController.updateUser(req.userId, req.body)
  .then(user => res.json(user))
  .catch(next);
});
