'use strict';

process.env.APP_SECRET = process.env.APP_SECRET || 'Im a secret!!!!!';
process.env.MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost/test';

// npm
const expect = require('chai').expect;
const request = require('superagent-use');
const superPromise = require('superagent-promise-plugin');
const debug = require('debug')('shooter: match test');

//const User = require('../model/user-model');
const userController = require('../controller/auth-controller');
const rifleController = require('../controller/rifle-controller');
const compController = require('../controller/competition-controller');
const matchController = require('../controller/match-controller');
// const shotController = require('../controller/shot-controller');

const port = process.env.PORT || 3000;

const baseUrl = `http://localhost:${port}/api`;
const server = require('../server');
request.use(superPromise);

describe('testing our rifle model', function() {
  before((done) => {
    debug('rifle-testing-before-block');
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

  var user = {
    _id: '576c47d854d007350a734560',
    password: '$2a$09$4zNSZ5AtttLPnjs8KaXpaur4aRucsAqesMqSLe0wt4fXL.X7fDb1C',
    username: 'McTest',
    findHash: 'f517531581cb0323dea580d7c0016a79812e7ffa3790f04786ee836d2fac1822'
  };
  var competition = {
    _id: '576c4a4011d3f63f0a05d475',
    userId: '576c47d854d007350a734560',
    location: 'Ben Avery',
    action: 'BAT'
  };
  var match = {
    competitionId: '576c4a4011d3f63f0a05d475',
    userId: '576c47d854d007350a734560',
    matchNumber: 1,
    _id: '576c4f19965f8a8a0ab5397f'
  };
  var barrel = {
    _id:'576c47d854d007350a734560'
  };

  describe('testing the rifle POST route', function() {
    before((done) => {
      debug('rifle-post-test-before-block');
      userController.newUser({username: user.username, password: user.password})
      .then(token => {
        this.tempToken = token;
        done();
      }).catch(done);
    });

    after((done) => {
      debug('rifle-post-test-after-block');
      Promise.all([
        compController.removeAllCompetition(),
        rifleController.removeAllRifles(),
        matchController.removeAllMatches(),
        userController.removeAllUsers()
      ]).then(() => done())
      .catch(done);
    });

    it('should return a rifle', (done) => {
      debug('post-test');
      request.post(`${baseUrl}/user/${user._id}/rifle`)
      .send({
        rifleName: 'Ol Betsy',
        rifleAction: 'Remington',
        rifleCategory: 'FTR',
        matchId: match._id,
        competitionId: competition._id,
        userId: user._id,
        barrelId: barrel._id
      }).set({Authorization: `Bearer ${this.tempToken}`})
      .then((res) => {
        expect(res.status).to.equal(200);
        expect(res.body.rifleName).to.equal('Ol Betsy');
        expect(res.body.rifleAction).to.equal('Remington');
        expect(res.body.rifleCategory).to.equal('FTR');
        done();
      }).catch(done);
    });
  });

  describe('testing the rifle GET route', function() {
    before((done) => {
      debug('rifle-get-test-before-block');
      userController.newUser({username: user.username, password: user.password})
      .then(token => {
        this.tempToken = token;
        rifleController.createRifle({
          rifleName: 'Shooter McGavin',
          rifleAction: 'Remington',
          rifleCategory: 'sling',
          matchId: match._id,
          competitionId: competition._id,
          userId: user._id,
          barrelId: barrel._id
        }).then(rifle => {
          this.tempRifle = rifle;
          done();
        }).catch(done);
      }).catch(done);
    });

    after((done) => {
      debug('rifle-get-test-after-block');
      Promise.all([
        compController.removeAllCompetition(),
        rifleController.removeAllRifles(),
        matchController.removeAllMatches(),
        userController.removeAllUsers()
      ]).then(() => done())
      .catch(done);
    });

    it('should return a rifle', (done) => {
      debug('get-test');
      request.get(`${baseUrl}/user/${user._id}/rifle/${this.tempRifle._id}`)
      .set({Authorization: `Bearer ${this.tempToken}`})
      .then(res => {
        expect(res.status).to.equal(200);
        expect(res.body.rifleName).to.equal('Shooter McGavin');
        expect(res.body.rifleAction).to.equal('Remington');
        expect(res.body.rifleCategory).to.equal('sling');
        done();
      }).catch(done);
    });
  });
});
