'use strict';

process.env.APP_SECRET = process.env.APP_SECRET || 'Im a secret!!!!!';
process.env.MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost/db';

// npm
const expect = require('chai').expect;
const request = require('superagent-use');
const superPromise = require('superagent-promise-plugin');
const debug = require('debug')('shooter');

const authController = require('../controller/auth-controller');
const competitionController = require('../controller/competition-controller');

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

/******** PUT USER TEST ********/
  describe('testing user update route with valid request', function(){
    before((done) => {
      debug('PUT-user-before-block');
      authController.newUser({username: 'tester', password: 'openSaysMe!', nraNumber: 11235813213455, nraQualification: 'test master', firstName: 'Billy', lastName: 'Smith'})
      .then( token => {
        this.tempToken = token;
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

/******** GET ALL COMPS TEST ********/
  describe('testing get for user route to get all comps by userId', function(){
    beforeEach((done)=>{
      authController.newUser({username: 'pippy', password: 'stalkings', firstName: 'Billy', lastName: 'Smith'})
      .then(token => this.tempToken = token)
      .then(token => {
        return request.post(`${baseUrl}/competition`)
        .set({
          Authorization: `Bearer ${token}`
        })
        .send({
          location: 'test location',
          action: 'test action',
          caliber: 308,
          dateOf: 'May 28 2016'
        })
        .then(res => {
          return this.tempCompetition = res.body;
        });
      })
      .then(() => done())
      .catch(done);
    });
    afterEach((done)=> {
      Promise.all([
        authController.removeAllUsers(),
        competitionController.removeAllCompetition()
      ])
      .then(()=> done())
      .catch(done);
    });
    describe('testing get /api/competitions', () => {
      it('should return an array of competitions', (done) => {
        request.get(`${baseUrl}/competitions`)
        .set({
          Authorization: `Bearer ${this.tempToken}`
        })
        .then(res => {
          expect(res.status).to.equal(200);
          done();
        })
        .catch(done);
      });
    });
    it('should return an error of 401 not authorized', (done) => {
      request.get(`${baseUrl}/competitions`)
      .then(done)
      .catch(err => {
        const res = err.response;
        expect(res.status).to.equal(401);
        done();
      });
    });
  });

/******** GET USER TEST ********/
  describe('testing the getUser route on api/user', () => {
    before((done) => {
      debug('GET-user-before-block');
      authController.newUser({username: 'testerson', password: 'getMeInfo', nraNumber: 11235813213455, nraQualification: 'test master', firstName: 'Bobert', lastName: 'Smitty'})
      .then( token => {
        this.tempToken = token;
        done();
      })
      .catch(done);
    });

    after((done) => {
      debug('GET-user-after-block');
      authController.removeAllUsers()
      .then(() => done())
      .catch(done);
    });

    it('should return a user model', (done) => {
      request.get(`${baseUrl}/user`)
      .set({
        Authorization: `Bearer ${this.tempToken}`
      })
      .then(res => {
        expect(res.status).to.equal(200);
        expect(res.body.firstName).to.equal('Bobert');
        expect(res.body.lastName).to.equal('Smitty');
        expect(res.body.nraNumber).to.equal(11235813213455);
        done();
      })
      .catch(done);
    });
  });
});
