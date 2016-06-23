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
          action: 'test action'
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
          action: 'another test action'
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
    });
  });
});
