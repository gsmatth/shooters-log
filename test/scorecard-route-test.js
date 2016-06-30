'use strict';

process.env.APP_SECRET = process.env.APP_SECRET || 'Im a secret!!!!!';
process.env.MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost/db';

// npm
const expect = require('chai').expect;
const request = require('superagent-use');
const superPromise = require('superagent-promise-plugin');
const debug = require('debug')('shooter: scorecard test');

const User = require('../model/user-model');
const userController = require('../controller/auth-controller');
const compController = require('../controller/competition-controller');
const matchController = require('../controller/match-controller');
const shotController = require('../controller/shot-controller');

const port = process.env.PORT || 3000;

const baseUrl = `http://localhost:${port}/api`;
const server = require('../server');
request.use(superPromise);

describe('testing the ScoreCard route', function(){ //setting up our server
  before((done) => {
    debug('before-block-scorecard-test');
    if(!server.isRunning) {
      server.listen(port, () => {
        server.isRunning = true;
        console.log('server up on port:', port);
        done();
      });
      return;
    }
    done();
  });

  after((done) => {
    debug('after-block-scorecard-test');
    if(server.isRunning) {
      server.close(() => {
        server.isRunning = false;
        console.log('server is down');
        done();
      });
      return;
    }
    done();
  });
  describe('testing GET  ScoreCard route', function(){
    before((done) => { // creating our test resources
      debug('before-block-GET-scorecard');
      var user = new User({username: 'MrTest', password: 'ye-pass'});
      userController.newUser({username: user.username, password: user.password})
      .then( token => {
        this.tempToken = token;
        compController.createCompetition({
          userId: user._id,
          location: 'test range',
          action: 'to test',
          caliber: '308',
          dateOf: 'May 28 2016'
        })
        .then(competition => {
          this.tempCompetition = competition;
          matchController.createMatch(this.tempCompetition._id, {
            competitionId: this.tempCompetition._id,
            userId       :this.tempCompetition.userId,
            matchNumber: 1,
            targetNumber: 4,
            distanceToTarget: 600,
            relay: 4,
            startTime: '16:00',
            temperature: 55,
            windDirection: 12,
            windSpeed:  12,
            lightDirection: 2,
            weather: 'Seattle Sunshine'
          }).then(match => {
            this.tempMatch = match;
            shotController.createShot({
              userId: this.tempCompetition.userId,
              matchId: this.tempMatch._id,
              xValue: true,
              score: '10',
              dateOf: 'March 29th'
            })
            shotController.createShot({
              userId: this.tempCompetition.userId,
              matchId: this.tempMatch._id,
              xValue: true,
              score: '10',
              dateOf: 'March 29th'
            })
            shotController.createShot({
              userId: this.tempCompetition.userId,
              matchId: this.tempMatch._id,
              xValue: true,
              score: '10',
              dateOf: 'March 29th'
            })
          })
          matchController.createMatch(this.tempCompetition._id, {
            competitionId: this.tempCompetition._id,
            userId       :this.tempCompetition.userId,
            matchNumber: 3,
            targetNumber: 4,
            distanceToTarget: 500,
            relay: 4,
            startTime: '16:45',
            temperature: 55,
            windDirection: 1,
            windSpeed:  12,
            lightDirection: 2,
            weather: 'Seattle Sunshine'
          })
          .then(match => {
            this.tempMatch = match;
            shotController.createShot({
              userId: this.tempCompetition.userId,
              matchId: this.tempMatch._id,
              xValue: true,
              score: '10',
              dateOf: 'March 29th'
            })
            shotController.createShot({
              userId: this.tempCompetition.userId,
              matchId: this.tempMatch._id,
              xValue: true,
              score: '10',
              dateOf: 'March 29th'
            });
            shotController.createShot({
              userId: this.tempCompetition.userId,
              matchId: this.tempMatch._id,
              xValue: true,
              score: '10',
              dateOf: 'March 29th'
            });
          })
          matchController.createMatch(this.tempCompetition._id, {
            competitionId: this.tempCompetition._id,
            userId       :this.tempCompetition.userId,
            matchNumber: 2,
            targetNumber: 4,
            distanceToTarget: 500,
            relay: 4,
            startTime: '16:20',
            temperature: 55,
            windDirection: 1,
            windSpeed:  12,
            lightDirection: 2,
            weather: 'Seattle Sunshine'
          }).then(match => {
            this.tempMatch = match;
            shotController.createShot({
              userId: this.tempCompetition.userId,
              matchId: this.tempMatch._id,
              xValue: true,
              score: '10',
              dateOf: 'March 29th'
            })
            shotController.createShot({
              userId: this.tempCompetition.userId,
              matchId: this.tempMatch._id,
              xValue: true,
              score: '10',
              dateOf: 'March 29th'
            })
            shotController.createShot({
              userId: this.tempCompetition.userId,
              matchId: this.tempMatch._id,
              xValue: true,
              score: '10',
              dateOf: 'March 29th'
            })
            done();
          })
          .catch(done);
        })
        .catch(done);
      })
      .catch(done);
    });

    after((done)=>{
      debug('GET-after-block');
      Promise.all([
        shotController.removeAllShots(),
        compController.removeAllCompetition(),
        matchController.removeAllMatches(),
        userController.removeAllUsers()
      ])
      .then(() => done())
      .catch(done);
    });
    it('should return a competition and 3 matches', (done) => {
      debug('scorecard test with valid data');
      request.get(`${baseUrl}/scorecard/${this.tempCompetition._id}`)
      .set({Authorization: `Bearer ${this.tempToken}`})
      .then((res) => {
        expect(res.status).to.equal(200);
        console.log('RES>BODY', res.body);
        done();
      }).catch(done);
    });
    it('should return a 404', (done) => {
      debug('scorecard test with invalid data');
      request.get(`${baseUrl}/scorecard/32i4h23ij4b32ib23b2b`)
      .set({Authorization: `Bearer ${this.tempToken}`})
      .then(done)
      .catch(err => {
        const res = err.response;
        expect(res.status).to.equal(404);
        done();
      });
    })
  });
});
