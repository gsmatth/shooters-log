'use strict';

const Router = require('express').Router;
const debug = require('debug')('shooter:shot-router');
const httpErrors = require('http-errors');
const jsonParser = require('body-parser').json();
const shotController = require('../controller/shot-controller');
const parseBearerAuth = require('../lib/parse-bearer-auth');
const shotRouter = module.exports = new Router();

shotRouter.get('/competition/:competitionId/match/:matchId/shot/:shotId', parseBearerAuth, function(req, res, next){
  debug('entered shotRouter.get route');
  shotController.getShot(req.params.shotId)
  .then(shot => {
    if(!shot){
      return next(httpErrors(404, 'shot not found'));
    }
    res.json(shot);
  })
  .catch(next);
});

shotRouter.get('/competition/:competitionId/match/:matchId/shot/', parseBearerAuth, (req, res, next) => {
  next(httpErrors(400, 'no match id provided'));
});

shotRouter.post('/competition/:competitionId/match/:matchId/shot', parseBearerAuth, jsonParser, (req, res, next) => {
  debug('entered shotRouter.post route');
  req.body.userId =req.userId;
  req.body.shotId = req.shotId;
  req.body.matchId = req.params.matchId;
  // req.body.competitionId = req.params.competitionId;
  req.body.userId = req.userId;
  console.log('\nREQ params: \n', req.params);
  console.log('\nREQ BODY: \n', req.body);
  shotController.createShot(req.body)
  .then( shot => res.json(shot))
  .catch(next);
});

shotRouter.delete('/competition/:competitionid/match/:matchid/shot/:shotid', parseBearerAuth, (req, res, next) => {
  debug('entered shotRouter.delete route');
  shotController.deleteShot(req.params.shotid)
  .then(() => {
    res.status(204).send();
  })
  .catch(next);
});

shotRouter.put('/competition/:competitionid/match/:matchid/shot/:shotid', parseBearerAuth, jsonParser, (req, res, next) => {
  debug('entered shotRouter.put route');
  shotController.putShot(req.params.shotid, req.body)
  .then(shot => {
    if(!shot){
      return next(httpErrors(404, 'no shot found'));
    }
    res.json(shot);
  })
  .catch(next);
});
