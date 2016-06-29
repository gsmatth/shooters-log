'use strict';


const Router = require('express').Router;
const debug = require('debug')('shooter:barrel-router');
const barrelController = require('../controller/barrel-controller');
const parseBearerAuth = require('../lib/parse-bearer-auth');
const barrelRouter = module.exports = new Router();
const jsonParser = require('body-parser').json();
const httpErrors = require('http-errors');



barrelRouter.get('/user/:userid/barrel/:barrelid', parseBearerAuth, function(req, res, next){
  debug('entered barrel.get route');

});

barrelRouter.post('/user/:userid/barrel', parseBearerAuth, jsonParser, function(req, res, next){
  debug('entered barrel.post route');
  req.body.userId = req.params.userid;
  barrelController.createBarrel(req.body)
  .then(barrel => res.json(barrel))
  .catch(err => httpErrors(404, err.message));
});

barrelRouter.put('/user/:userid/barrel/:barrelid', parseBearerAuth, jsonParser, function(req, res, next){
  debug('entered barrel.put route');
});

barrelRouter.delete('/user/:userid/barrel/:barrelid', parseBearerAuth, function(req, res, next){
  debug('entered barrel.delete route');
});
