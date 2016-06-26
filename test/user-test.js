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

describe('testing user router', function(){
  before((done)=> {
    debug('before user-router');
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
    debug('after user-router');
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

  describe('testing user update route with valid request', function(){
    before((done) => {
      debug('PUT-user-before-block');
      authController.newUser({username: 'tester', password: 'openSaysMe!', nraNumber: 11235813213455, nraQualification: 'test master'})
      .then( token => {
        this.tempToken = token;
        console.log('temp token', this.tempToken);
        done();
      })
      .catch(done);
    });

    after((done) => {
      debug('PUT-sigin-after-block');
      authController.removeAllUsers()
      .then(() => done())
      .catch(done);
    });

    it('should return an object with username, NRA number and NRA qualification', (done) => {
      debug('PUT-update-NRAnumber-valid-test');
      request.put(`${baseUrl}/user`)
      .set({
        Authorization: `Bearer ${this.tempToken}`
      })
      .send({nraNumber: 5500000000000005})
      .then(res => {
        expect(res.status).to.equal(200);
        expect(res.body.nraNumber).to.equal(5500000000000005);
        done();
      })
      .catch(done);
    });
    it('should return a 400', (done) => {
      debug('PUT-update-invalid-test');
      request.put(`${baseUrl}/user`)
      .set({
        Authorization: `Bearer ${this.tempToken}`
      })
      .then(done)
      .catch( err => {
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
});
