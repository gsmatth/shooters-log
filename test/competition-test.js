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

describe('testing module competition-router', function(){
  before((done)=> {
    debug('before module competition-router');
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
    debug('after module competition-router');
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

  describe('testing module competition router', function(){
    beforeEach((done)=>{
      authController.newUser({username: 'pippy', password: 'stalkings'})
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
    describe('testing post /api/competition', () => {
      it('should return a competition', (done) => {
        request.post(`${baseUrl}/competition`)
        .send({
          location: 'another test location',
          action: 'another test action',
          caliber: 308,
          dateOf: 'May 28 2016'
        })
        .set({
          Authorization: `Bearer ${this.tempToken}`
        })
        .then( res => {
          expect(res.status).to.equal(200);
          done();
        })
        .catch(done);
      });
      it('2 should return a 401', (done) => {
        request.post(`${baseUrl}/competition`)
        .send({
          location: 'Hoolahoop',
          action: 'can do like so many circles'
        })
        .set({
          Authorization: 'Bearer '
        })
        .then(done)
        .catch(err => {
          const res = err.response;
          expect(res.status).to.equal(401);
          done();
        });
      });
      it('3 should return a 400', (done) => {
        request.post(`${baseUrl}/competition`)
        .send({
          name: 'bad request',
          desc: 'not valid'
        })
        .set({
          Authorization: `Bearer ${this.tempToken}`
        })
        .then(done)
        .catch(err => {
          const res = err.response;
          expect(res.status).to.equal(400);
          done();
        });
      });
    });
    describe('testing get api/competition/:id', () => {
      it('should return a competition', (done) => {
        request.get(`${baseUrl}/competition/${this.tempCompetition._id}`)
        .set({
          Authorization: `Bearer ${this.tempToken}`
        })
        .then(res => {
          expect(res.status).to.equal(200);
          done();
        })
        .catch(done);
      });
      it('should return a 401', (done) => {
        request.get(`${baseUrl}/competition/${this.tempCompetition._id}`)
        .set({
          Authorization: 'Bearer'
        })
        .then(done)
        .catch(err => {
          const res = err.response;
          expect(res.status).to.equal(401);
          done();
        });
      });
      it('should return a 404', (done) => {
        request.get(`${baseUrl}/competition/32i4h23ij4b32ib23b2b`)
        .set({
          Authorization: `Bearer ${this.tempToken}`
        })
        .then(done)
        .catch(err => {
          const res = err.response;
          expect(res.status).to.equal(404);
          done();
        });
      });
      it('should return a 400', (done) => {
        request.get(`${baseUrl}/competition`)
        .then(done)
        .catch(err => {
          const res = err.response;
          expect(res.status).to.equal(400);
          done();
        });
      });
    });
    describe('testing PUT at api/competition/:id', ()=> {
      it('should return a new talent', (done) => {
        request.put(`${baseUrl}/competition/${this.tempCompetition._id}`)
        .set({
          Authorization: `Bearer ${this.tempToken}`
        })
        .send({
          location: 'Best location',
          action: 'Best action'
        })
        .then( res => {
          expect(res.status).to.equal(200);
          done();
        }).catch(done);
      });
      it('should return a 401', (done)=> {
        request.put(`${baseUrl}/competition/${this.tempCompetition._id}`)
        .send({
          location: 'blah',
          action: 'deblah'
        })
        .then(done)
        .catch(err => {
          const res = err.response;
          expect(res.status).to.equal(401);
          done();
        });
      });
    });
  });
});
