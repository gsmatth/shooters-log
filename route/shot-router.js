'use strict';

const Router = require('express').Router;
const debug = require('debug')('shooter:shot-router');

const shotController = require('../controller/shot-controller');
const parseBearerAuth = require('../lib/parse-bearer-auth');

const shotRouter = module.exports = new Router();
const jsonParser = require('body-parser').json();

shotRouter.get('/competition/:competitionId/match/:matchId/shot/:shotId', function(req, res, next){
  debug('entered shotRouter.get route');
  shotController.getShot(req.params.id)
  .then(shot => res.send(shot))
  .catch(next);
});

shotRouter.post('/competition/:competitionId/match/:matchId/shot', parseBearerAuth, jsonParser, function(req, res, next){
  debug('entered shotRouter.post route');
  req.body.shotId = req.shotId;
  shotController.createShot(req.body)
  .then( shot => res.json(shot))
  .catch(next);
});

shotRouter.delete('/competition/:competitionid/match/:matchid/shot/:shotid', function(req, res, next){
  debug('entered shotRouter.delete route');
  shotController.deleteShot(req.params.shotid)
  .then(shot => res.send(shot))
  .catch(next);
});

// shotRouter.put('/competition/:id/match/:id/shot/:id', function(req, res, next){
//   debug('entered shotRouter.delete route');
//   shotController.putShot()
// });
