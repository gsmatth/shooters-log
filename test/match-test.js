'use strict';

process.env.APP_SECRET = process.env.APP_SECRET || 'Im a secret!!!!!';
process.env.MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost/db';

// npm
const expect = require('chai').expect;
const request = require('superagent-use');
const superPromise = require('superagent-promise-plugin');
const debug = require('debug')('shooter: match test');

const UserShema = require('../model/user-model.js');
const userController = require('../controller/auth-controller');
const compController = require('../controller/competition-controller');
const matchController = require('../controller/match-controller');

const port = process.env.PORT || 3000;

const baseUrl = `localhost:${port}/api`;
const server = require('../server');
request.use(superPromise);

describe('testing the match route', function(){
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
    before((done) => {
      new UserSchema({username: 'McTest', password: 'pass'})
      .then( user => {
        this.tempUserID = userId;
      })
      .then(compController.createCompetition({
        user_id: token,
        location: 'test range',
        action: 'to test',
      })).then(competition => {
        this.tempCompetition = competition;
        done();
      })
      .catch(done);
    });
    after((done)=>{
      debug('POST-after-block');
      compController.removeAllCompetition()
      .then((matchController.removeAllMatches()) => done())
      .catch(done);
    });
    it('should return a match', (done) => {
      debug('match POST route');
      request.post(`${baseUrl}/competition/:${competition}/match`)
      .send({
        matchNumber:
      })
    });
  });
});
