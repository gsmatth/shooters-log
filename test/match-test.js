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
          action: 'to test'
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
        matchNumber: 1
      })
      .set({Authorization: `Bearer ${this.tempToken}`})
      .then((res) => {
        expect(res.status).to.equal(200);
        expect(res.body.competitionId).to.equal(`${this.tempCompetition._id}`);
        expect(res.body.matchNumber).to.equal(1);
        done();
      }).catch(done);
    });

    describe('testing POST bad request', () => {
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

    describe('testing POST unauthorized', () => {
      it('should return a 401', (done) => {
        debug('match-post-401-error');
        request.post(`${baseUrl}/competition/${this.tempCompetition._id}/match`)
        .send({matchNumber: 2})
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
        request.post(`${baseUrl}/competition/6132548761254/match`)
        .send({matchNumber: 3})
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
          action: 'to test'
        })
        .then(competition => {
          this.tempCompetition = competition;
          console.log('this.tempCompetition', this.tempCompetition, 'this.tempCompetition.userId', this.tempCompetition.userId);
          matchController.createMatch(this.tempCompetition._id, {
            competitionId: this.tempCompetition._id,
            userId       :this.tempCompetition.userId,
            matchNumber  : 1
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
  });

});
