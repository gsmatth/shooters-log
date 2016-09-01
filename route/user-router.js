'use strict';

const Router = require('express').Router;
const jsonParser = require('body-parser').json();
const debug = require('debug')('shooter:userRouter');
const authController = require('../controller/auth-controller');
const parseBearerAuth = require('../lib/parse-bearer-auth');
const httpErrors = require('http-errors');

const userRouter = module.exports = new Router();

userRouter.put('/user', jsonParser, parseBearerAuth, function(req, res, next){
  debug('user PUT route');
  req.body.userId = req.userId;
  authController.updateUser(req.userId, req.body)
  .then(user => res.json(user))
  .catch(next);
});

userRouter.get('/competitions', parseBearerAuth, function(req, res, next) {
  debug('entered userRouter.get for all competitions route');
  authController.fetchCompsByUser(req.userId)
  .then(competitions => {
    if(!competitions){
      return next(httpErrors(404, 'no competitions found for user'));
    }
    console.log('These are the COMPETITIONS!!!', competitions);
    res.json(competitions);
  }).catch(next);
});
