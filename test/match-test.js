'use strict';

process.env.APP_SECRET = process.env.APP_SECRET || 'Im a secret!!!!!';
process.env.MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost/db';

// npm
const expect = require('chai').expect;
const request = require('superagent-use');
const superPromise = require('superagent-promise-plugin');
const debug = require('debug')('shooter: match test');

const User = require('../model/user-model');
const userController = require('../controller/auth-controller');
const compController = require('../controller/competition-controller');
const matchController = require('../controller/match-controller');
const shotController = require('../controller/shot-controller');

const port = process.env.PORT || 3000;

const baseUrl = `http://localhost:${port}/api`;
const server = require('../server');
request.use(superPromise);

describe('testing the match route', function(){ //setting up our server
  before((done) => {
    debug('before-block-match-test');
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
    debug('after-block-match-test');
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

  describe('testing POST route', function(){
    before((done) => { // creating our test resources
      debug('before-block-post-match');
      //userController.newUser({username:'McTest', password: 'pass'})
      var user = new User({username: 'McTest', password: 'pass'});
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
          done();
        }).catch(done);
      }).catch(done);
    });

    after((done)=>{
      debug('POST-after-block');
      Promise.all([
        compController.removeAllCompetition(),
        matchController.removeAllMatches(),
        userController.removeAllUsers()
      ])
      .then(() => done())
      .catch(done);
    });

    it('should return a match', (done) => {
      debug('match POST route');
      request.post(`${baseUrl}/competition/${this.tempCompetition._id}/match`)
      .send({
        matchNumber: 1,
        targetNumber: 4,
        distanceToTarget: 600
      })
      .set({Authorization: `Bearer ${this.tempToken}`})
      .then((res) => {
        expect(res.status).to.equal(200);
        expect(res.body.competitionId).to.equal(`${this.tempCompetition._id}`);
        expect(res.body.matchNumber).to.equal(1);
        expect(res.body.targetNumber).to.equal(4);
        expect(res.body.distanceToTarget).to.equal(600);
        done();
      }).catch(done);
    });

    describe('testing POST bad request empty send block', () => {
      it('should return a 400', (done) => {
        debug('match-post-400-error');
        request.post(`${baseUrl}/competition/${this.tempCompetition._id}/match`)
        .send({})
        .set({Authorization: `Bearer ${this.tempToken}`})
        .then(done)
        .catch(err => {
          try {
            const res = err.response;
            expect(res.status).to.equal(400);
            done();
          } catch (err) {
            done(err);
          }
        });
      });
    });

    describe('testing POST bad request missing distanceToTarget', () => {
      it('should return a 400', (done) => {
        debug('match-post-400-error');
        request.post(`${baseUrl}/competition/${this.tempCompetition._id}/match`)
        .send({
          matchNumber: 1,
          targetNumber: 4
        })
        .set({Authorization: `Bearer ${this.tempToken}`})
        .then(done)
        .catch(err => {
          try {
            const res = err.response;
            expect(res.status).to.equal(400);
            done();
          } catch (err) {
            done(err);
          }
        });
      });
    });

    describe('testing POST unauthorized', () => {
      it('should return a 401', (done) => {
        debug('match-post-401-error');
        request.post(`${baseUrl}/competition/${this.tempCompetition._id}/match`)
        .send({
          matchNumber: 1,
          targetNumber: 4,
          distanceToTarget: 600
        })
        .set({})
        .then(done)
        .catch( err => {
          try {
            const res = err.response;
            expect(res.status).to.equal(401);
            done();
          } catch (err) {
            done(err);
          }
        });
      });
    });

    describe('testing POST not found', () => {
      it('should return a 404', (done) => {
        debug('match-post-404-error');
        request.post(`${baseUrl}/competition/623564512374/match`)
        .send({
          matchNumber: 1,
          targetNumber: 4,
          distanceToTarget: 600
        })
        .set({Authorization: `Bearer ${this.tempToken}`})
        .then(done)
        .catch( err => {
          try {
            const res = err.response;
            expect(res.status).to.equal(404);
            done();
          } catch (err) {
            done(err);
          }
        });
      });
    });
  });

  describe('testing GET route', function(){
    before((done) => { // creating our test resources
      debug('before-block-GET-match');
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
          console.log('this.tempCompetition', this.tempCompetition, 'this.tempCompetition.userId', this.tempCompetition.userId);
          matchController.createMatch(this.tempCompetition._id, {
            competitionId: this.tempCompetition._id,
            userId       :this.tempCompetition.userId,
            matchNumber: 1,
            targetNumber: 4,
            distanceToTarget: 600
          })
          .then(match => {
            console.log('THIS! Match', match);
            this.tempMatch = match;
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
        compController.removeAllCompetition(),
        matchController.removeAllMatches(),
        userController.removeAllUsers()
      ])
      .then(() => done())
      .catch(done);
    });

    it('should return a match', (done) => {
      debug('match GET route');
      request.get(`${baseUrl}/competition/${this.tempCompetition._id}/match/${this.tempMatch._id}`)
      .set({Authorization: `Bearer ${this.tempToken}`})
      .then((res) => {
        expect(res.status).to.equal(200);
        expect(res.body.competitionId).to.equal(`${this.tempCompetition._id}`);
        expect(res.body.matchNumber).to.equal(1);
        done();
      }).catch(done);
    });
    it('should return a 404', (done) => {
      debug('match 404 GET route');
      request.get(`${baseUrl}/competition/${this.tempCompetition._id}/match/576ca4133c21e4bd13fff888`)
      .set({Authorization: `Bearer ${this.tempToken}`})
      .then(done)
      .catch( err => {
        try {
          const res = err.response;
          expect(res.status).to.equal(404);
          done();
        } catch (err) {
          done(err);
        }
      });
    });
  });
  describe('testing PUT route', function(){
    before((done) => { // creating our test resources
      debug('before-block-PUT-match');
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
          console.log('this.tempCompetition', this.tempCompetition, 'this.tempCompetition.userId', this.tempCompetition.userId);
          matchController.createMatch(this.tempCompetition._id, {
            competitionId: this.tempCompetition._id,
            userId       :this.tempCompetition.userId,
            matchNumber: 1,
            targetNumber: 4,
            distanceToTarget: 600
          })
          .then(match => {
            console.log('THIS! Match', match);
            this.tempMatch = match;
            done();
          })
          .catch(done);
        })
        .catch(done);
      })
      .catch(done);
    });

    after((done)=>{
      debug('PUT-after-block');
      Promise.all([
        compController.removeAllCompetition(),
        matchController.removeAllMatches(),
        userController.removeAllUsers()
      ])
      .then(() => done())
      .catch(done);
    });

    it('should return a match with new matchNumber', (done) => {
      debug('match PUT route matchNumber');
      request.put(`${baseUrl}/competition/${this.tempCompetition._id}/match/${this.tempMatch._id}`)
      .send({matchNumber: 3})
      .set({Authorization: `Bearer ${this.tempToken}`})
      .then((res) => {
        expect(res.status).to.equal(200);
        expect(res.body.competitionId).to.equal(`${this.tempCompetition._id}`);
        expect(res.body.matchNumber).to.equal(3);
        done();
      }).catch(done);
    });
    it('should return a match with new distanceToTarget', (done) => {
      debug('match PUT route distanceToTarget');
      request.put(`${baseUrl}/competition/${this.tempCompetition._id}/match/${this.tempMatch._id}`)
      .send({distanceToTarget: 1000})
      .set({Authorization: `Bearer ${this.tempToken}`})
      .then((res) => {
        expect(res.status).to.equal(200);
        expect(res.body.competitionId).to.equal(`${this.tempCompetition._id}`);
        expect(res.body.distanceToTarget).to.equal(1000);
        done();
      }).catch(done);
    });
    it('should return a 400', (done) => {
      debug('match 400 PUT route');
      request.put(`${baseUrl}/competition/${this.tempCompetition._id}/match/576ca4133c21e4bd13fff888`)
      .send({})
      .set({Authorization: `Bearer ${this.tempToken}`})
      .then(done)
      .catch( err => {
        try {
          const res = err.response;
          expect(res.status).to.equal(404);
          done();
        } catch (err) {
          done(err);
        }
      });
    });
    it('should return a 404', (done) => {
      debug('match 404 PUT route');
      request.put(`${baseUrl}/competition/${this.tempCompetition._id}/match/576ca4133c21e4bd13fff888`)
      .set({Authorization: `Bearer ${this.tempToken}`})
      .then(done)
      .catch( err => {
        try {
          const res = err.response;
          expect(res.status).to.equal(404);
          done();
        } catch (err) {
          done(err);
        }
      });
    });
  });
  describe('testing DELETE route', function(){
    before((done) => { // creating our test resources
      debug('before-block-DELETE-match');
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
          console.log('this.tempCompetition', this.tempCompetition, 'this.tempCompetition.userId', this.tempCompetition.userId);
          matchController.createMatch(this.tempCompetition._id, {
            competitionId: this.tempCompetition._id,
            userId       :this.tempCompetition.userId,
            matchNumber: 1,
            targetNumber: 4,
            distanceToTarget: 600
          })
          .then(match => {
            this.tempMatch = match;
            done();
          })
          .catch(done);
        })
        .catch(done);
      })
      .catch(done);
    });

    after((done)=>{
      debug('DELETE-after-block');
      Promise.all([
        compController.removeAllCompetition(),
        matchController.removeAllMatches(),
        userController.removeAllUsers()
      ])
      .then(() => done())
      .catch(done);
    });
    it('should return a 204', (done) => {
      debug('match DELETE route');
      request.del(`${baseUrl}/competition/${this.tempCompetition._id}/match/${this.tempMatch._id}`)
      .set({Authorization: `Bearer ${this.tempToken}`})
      .then((res) => {
        expect(res.status).to.equal(204);
        done();
      }).catch(done);
    });
    it('should return a 404', (done) => {
      debug('match 404 DELETE route');
      request.del(`${baseUrl}/competition/${this.tempCompetition._id}/match/576ca4133c21e4bd13fff888`)
      .set({Authorization: `Bearer ${this.tempToken}`})
      .then(done)
      .catch( err => {
        try {
          const res = err.response;
          expect(res.status).to.equal(404);
          done();
        } catch (err) {
          done(err);
        }
      });
    });
  });
  describe('testing GET all Shots by match ID route', function(){
    before((done) => { // creating our test resources
      debug('before-block-GET-ALL-SHOTS-bY-match');
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
          console.log('this.tempCompetition', this.tempCompetition, 'this.tempCompetition.userId', this.tempCompetition.userId);
          matchController.createMatch(this.tempCompetition._id, {
            competitionId: this.tempCompetition._id,
            userId       :this.tempCompetition.userId,
            matchNumber: 1,
            targetNumber: 4,
            distanceToTarget: 600
          })
          .then(match => {
            this.tempMatch = match;
            console.log('this.tempMatch', this.tempMatch);
            shotController.createShot({
              userId:`${this.tempMatch.userId}` ,
              matchId: `${this.tempMatch._id}`,
              xValue: true,
              score: '10',
              dateOf: 'May 38 2016'
            })
            .then(shot => {
              this.tempShot = shot;
              console.log('THIS NEW SHOT I MADE:', this.tempShot);
              done();
            })
            .catch(done);
          })
          .catch(done);
        })
        .catch(done);
      })
      .catch(done);
    });

    after((done)=>{
      debug('GET-all-shots-by-match-after-block');
      Promise.all([
        compController.removeAllCompetition(),
        matchController.removeAllMatches(),
        userController.removeAllUsers()
      ])
      .then(() => done())
      .catch(done);
    });

    it('should return all the shots in a match', (done) => {
      debug('match GET-all-shots-by-match route with valid data');
      request.get(`${baseUrl}/competition/${this.tempCompetition._id}/match/${this.tempShot.matchId}/shots`)
      .set({Authorization: `Bearer ${this.tempToken}`})
      .then((res) => {
        console.log('res.body:', res.body);
        expect(res.status).to.equal(200);
        expect(res.body[0].xValue).to.equal(true);
        done();
      }).catch(done);
    });
    it('should return a 404', (done) => {
      debug('match 404 GET-all-shots-by-match route with invalid match id');
      request.get(`${baseUrl}/competition/${this.tempCompetition._id}/match/576ca4133c21e4bd13fff888/shots`)
      .set({Authorization: `Bearer ${this.tempToken}`})
      .then(done)
      .catch( err => {
        try {
          const res = err.response;
          expect(res.status).to.equal(404);
          done();
        } catch (err) {
          done(err);
        }
      });
    });
  });
});
