'use strict';

process.env.APP_SECRET = process.env.APP_SECRET || 'Im a secret!!!!!';
process.env.MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost/db';

// npm
const expect = require('chai').expect;
const request = require('superagent-use');
const superPromise = require('superagent-promise-plugin');
const debug = require('debug')('shooter');

const authController = require('../controller/auth-controller');

const port = process.env.PORT || 3000;

const baseUrl = `localhost:${port}/api`;
const server = require('../server');
request.use(superPromise);

describe('testing the signup post route', function(){
  before((done) => {
    debug('before-block-signup-test');
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
    debug('after-block-signup-test');
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

  describe('testing POST api/signup with valid request', function(){
    after((done) => {
      debug('POST-after-block');
      authController.removeAllUsers()
      .then(() => done())
      .catch(done);
    });

    it('should return a token', function(done) {
      debug('POST-valid-test');
      request.post(`${baseUrl}/signup`)
      .send({username: 'tester', password: 'openSaysMe!', nraNumber: 11235813213455, nraQualification: 'test master', firstName: 'Billy', lastName: 'Smith'})
      .then(res => {
        expect(res.status).to.equal(200);
        expect(res.text.length).to.equal(253);
        done();
      })
      .catch(done);
    });
  });

  describe('testing signin GET route with valid request', function(){
    before((done) => {
      debug('GET-sigin-before-block');
      authController.newUser({username: 'tester', password: 'openSaysMe!', nraNumber: 11235813213455, nraQualification: 'test master', firstName: 'Billy', lastName: 'Smith'})
      .then(() => done())
      .catch(done);
    });

    after((done) => {
      debug('GET-sigin-after-block');
      authController.removeAllUsers()
      .then(() => done())
      .catch(done);
    });

    it('should return a token', function(done) {
      debug('GET-signin-valid-test');
      request.get(`${baseUrl}/signin`)
      .auth('tester', 'openSaysMe!')
      .then(res => {
        expect(res.status).to.equal(200);
        expect(res.text.length).to.equal(253);
        done();
      })
      .catch(done);
    });
  });

  describe('testing signin GET route with incorrect username or password', function(){
    before((done) => {
      debug('GET-sigin-before-block');
      authController.newUser({username: 'McTest', password: 'pass', firstName: 'Billy', lastName: 'Smith'})
      .then(() => done())
      .catch(done);
    });
    after((done) => {
      debug('GET-sigin-after-block');
      authController.removeAllUsers()
      .then(() => done())
      .catch(done);
    });

    it('should return a 404 error', function(done) {
      debug('GET-signin-valid-test');
      request.get(`${baseUrl}/signin`)
      .auth('noTesterWithThisName', 'noSuchPassword!')
      .then(done)
      .catch (err  => {
        const res = err.response;
        expect(res.status).to.equal(500);
        done();
      })
      .catch(done);
    });
  });


  describe('testing signin GET route with missing username', function(){
    before((done) => {
      debug('GET-sigin-before-block');
      authController.newUser({username: 'McTest', password: 'pass', firstName: 'Billy', lastName: 'Smith'})
      .then(() => done())
      .catch(done);
    });
    after((done) => {
      debug('GET-sigin-after-block');
      authController.removeAllUsers()
      .then(() => done())
      .catch(done);
    });

    it('should return a 401 error', function(done) {
      debug('GET-signin-valid-test');
      request.get(`${baseUrl}/signin`)
      .auth('', 'noSuchPassword!')
      .then(done)
      .catch (err  => {
        const res = err.response;
        expect(res.status).to.equal(401);
        done();
      })
      .catch(done);
    });
  });

});
