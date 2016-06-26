'use strict';

process.env.APP_SECRET = process.env.APP_SECRET || 'Im a secret!!!!!';
process.env.MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost/test';

// npm
const expect = require('chai').expect;
const request = require('superagent-use');
const superPromise = require('superagent-promise-plugin');
const debug = require('debug')('shooter:shot-route-test');

//const Shot = require('../model/shot-model');
const authController = require('../controller/auth-controller');
// const competitionController = require('../controller/competition-controller');
const shotController = require('../controller/shot-controller');
// const matchController = require('../controller/match-controller');

const port = process.env.PORT || 3000;

const baseUrl = `localhost:${port}/api`;
const server = require('../server');
request.use(superPromise);

describe('Testing shot-route ', function() {

  before((done)=> {
    debug('before module shot-router');
    if(!server.isRunning){
      server.listen(port, () => {
        server.isRunning = true;
        debug(`server up on port ${port}`);
        done();
      });
      return;
    }
    done();
  });
  after((done)=> {
    debug('after module shot-router');
    if(server.isRunning) {
      server.close(()=>{
        server.isRunning = false;
        debug('server down');
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
  var shotData = {
    userId:'576c47d854d007350a734560' ,
    matchId: '576c4f19965f8a8a0ab5397f',
    xValue: true,
    score: '10'
  };

  describe('POST', function(){

    before((done) => {
      debug('shot-POST-route-test-before-block');
      authController.newUser({username: user.username, password: user.password})
      .then( token => {
        this.tempToken = token;
        done();
      })
      .catch(done);
    });

    after((done)=>{
      debug('shot-POST-route-test-after-block');
      Promise.all([
        shotController.removeAllShots(),
        authController.removeAllUsers()
      ])
      .then(() => done())
      .catch(done);
    });

    describe('with a valid shot route', () => {
      it('should should return a new score', (done) => {
        debug('shot-POST-route-test-it-block');
        request.post(`${baseUrl}/competition/${competition._id}/match/${match._id}/shot`)
        .send(shotData)
        .set({Authorization: `Bearer ${this.tempToken}`})
        .then((res) => {
          expect(res.status).to.equal(200);
          expect(res.body.xValue).to.equal(true);
          expect(res.body.score).to.equal('10');
          done();
        })
        .catch(done);
      });
    });
    //the describe below should be part of controller-test
    describe('with invalid shot data', () => {
      it('should should return a 400', (done) => {
        debug('shot-POST-route-test-it-block');
        request.post(`${baseUrl}/competition/${competition._id}/match/${match._id}/shot`)
        .send({  userId:'576c47d854d007350a734560' ,
          matchId: '576c4f19965f8a8a0ab5397f',
          xValue: false,
          score: '6'})
        .set({Authorization: `Bearer ${this.tempToken}`})
        .then(done)
        .catch(err => {
          const res = err.response;
          expect(res.status).to.equal(400);
          done();
        });
      });
    });
  });

  describe('GET', function() {
    before((done) => {
      debug('shot-GET-route-test-before-block');
      authController.newUser({username: user.username, password: 'testpassword'})
      .then( token => {
        this.tempToken = token;
        shotController.createShot(shotData)
      .then(shot => {
        this.tempShot = shot;
        done();
      })
      .catch(done);
      });
    });

    after((done)=>{
      debug('shot-GET-route-test-after-block');
      Promise.all([
        shotController.removeAllShots(),
        authController.removeAllUsers()
      ])
      .then(() => done())
      .catch(done);
    });

    var shotData = {
      userId:'576c47d854d007350a734560' ,
      matchId: '576c4f19965f8a8a0ab5397f',
      xValue: false,
      score: 'M'
    };

    describe('with valid shotId', () => {
      it('should should return an existing score', (done) => {
        debug('shot-GET-route-test-it-block');
        request.get(`${baseUrl}/competition/${competition._id}/match/${match._id}/shot/${this.tempShot._id}`)
        .set({Authorization: `Bearer ${this.tempToken}`})
        .then((res) => {
          expect(res.status).to.equal(200);
          expect(res.body.xValue).to.equal(false);
          expect(res.body.score).to.equal('M');
          done();
        })
        .catch(done);
      });
    });
    describe('with invalid shotId,', () => {
      it('should should return a  404', (done) => {
        debug('shot-GET-invalid-route-test-it-block');
        request.get(`${baseUrl}/competition/${competition._id}/match/${match._id}/shot/1234567`)
        .set({Authorization: `Bearer ${this.tempToken}`})
        .then(done)
        .catch(err => {
          const res = err.response;
          expect(res.status).to.equal(404);
          done();
        });
      });
    });
  });


  describe('DELETE', function() {
    before((done) => { // create token for authorization
      debug('shot-DELETE-route-test-before-block');
      authController.newUser({username: user.username, password: 'testpassword'})
      .then( token => {
        this.tempToken = token;
        shotController.createShot(shotData)
      .then(shot => {
        this.tempShot = shot;
        done();
      })
      .catch(done);
      });
    });

    after((done)=>{
      debug('shot-DELETE-route-test-after-block');
      Promise.all([
        shotController.removeAllShots(),
        authController.removeAllUsers()
      ])
      .then(() => done())
      .catch(done);
    });

    describe('with valid shotId', () => {
      it('should should return a 204', (done) => {
        debug('shot-DELETE-route-test-it-block');
        request.del(`${baseUrl}/competition/${competition._id}/match/${match._id}/shot/${this.tempShot._id}`)
        .set({Authorization: `Bearer ${this.tempToken}`})
        .then (res => {
          expect(res.status).to.equal(204);
          done();
        })
        .catch(done);
      });
    });

    describe('with invalid shotId,', () => {
      it('should should return a  404', (done) => {
        debug('shot-DELETE-invalid-route-test-it-block');
        request.get(`${baseUrl}/competition/${competition._id}/match/${match._id}/shot/1234567`)
        .set({Authorization: `Bearer ${this.tempToken}`})
        .then(done)
        .catch(err => {
          const res = err.response;
          expect(res.status).to.equal(404);
          done();
        });
      });
    });

  });

  describe('PUT', function() {
    before((done) => { // create token for authorization
      debug('shot-PUT-route-test-before-block');
      authController.newUser({username: user.username, password: 'testpassword'})
      .then( token => {
        this.tempToken = token;
        shotController.createShot(shotData)
      .then(shot => {
        this.tempShot = shot;
        done();
      })
      .catch(done);
      });
    });

    after((done)=>{
      debug('shot-PUT-route-test-after-block');
      Promise.all([
        shotController.removeAllShots(),
        authController.removeAllUsers()
      ])
      .then(() => done())
      .catch(done);
    });

    describe('with valid shotId', () => {
      it('should return an updated shot', (done) => {
        debug('shot-PUT-route-test-it-block');
        request.put(`${baseUrl}/competition/${competition._id}/match/${match._id}/shot/${this.tempShot._id}`)
        .set({Authorization: `Bearer ${this.tempToken}`})
        .send({
          userId:'576c47d854d007350a734560' ,
          matchId: '576c4f19965f8a8a0ab5397f',
          xValue: false,
          score: '9'
        })
        .then((res) => {
          expect(res.status).to.equal(200);
          expect(res.body.xValue).to.equal(false);
          expect(res.body.score).to.equal('9');
          done();
        })
        .catch(done);
      });
    });
    describe('with invalid shotId,', () => {
      it('should return a  404', (done) => {
        debug('shot-PUT-invalid-route-test-it-block');
        request.get(`${baseUrl}/competition/${competition._id}/match/${match._id}/shot/1234567`)
        .set({Authorization: `Bearer ${this.tempToken}`})
        .then(done)
        .catch(err => {
          const res = err.response;
          expect(res.status).to.equal(404);
          done();
        });
      });
    });
  });

});
