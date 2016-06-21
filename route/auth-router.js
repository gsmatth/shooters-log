'use strict';

const Router = require('express').Router;
const jsonParser = require('body-parser').json();
const debug = require('debug')('shooter:sigupRouter');
const authController = require('../controller/auth-controller');

const authRouter = module.exports = new Router();

authRouter.post('/signup', jsonParser, function(req, res, next){
  debug('post api/signup');
  authController.newUser(req.body)
  .then((token) => res.send(token))
  .catch(next);
});
