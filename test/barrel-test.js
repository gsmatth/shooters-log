'use strict';

process.env.APP_SECRET = process.env.APP_SECRET || 'Im a secret!!!!!';
process.env.MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost/test';

// npm
const expect = require('chai').expect;
const request = require('superagent-use');
const superPromise = require('superagent-promise-plugin');
const debug = require('debug')('shooter: barrel-test');

const Barrel = require('../model/barrel-model');
const barrelController = require('../controller/barrel-controller');
const userController = require('../controller/auth-controller');
// const compController = require('../controller/competition-controller');
// const matchController = require('../controller/match-controller');
// const shotController = require('../controller/shot-controller');

const port = process.env.PORT || 3000;

const baseUrl = `http://localhost:${port}/api`;
const server = require('../server');
request.use(superPromise);

describe('Testing barrel route, ', () =>  {
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



  describe('POST barrel with userId.  ', () => {
    var user = new User({username: 'McTest', password: 'pass'});
    userController.newUser({username: user.username, password: user.password})
    .then( token => {
      this.tempToken = token;
        userId: user._id,


    it('should return a barrel response', () => {
      request.post(`${baseUrl}/user/:userid/barrel`)
      .send({
        barrelManufacturer: 'Kreiger',
        barrelType: 'medium palma',
        barrelTwist: '1:10',
        barrelLength: 30,
        barrelLife: 3500,
        barrelCaliber: 30,
        roundCount: 1700,
        userId:
      })
      .set({Authorization: `Bearer ${this.tempToken}`})
      .then((res) => {
        expect(res.status).to.equal(200);
        expect(res.body.barrelManufacturer).to.equal('Kreiger');
        expect(res.body.barrelLife).to.equal(3500);
        expect(res.body.roundCount).to.equal(1700);
        expect(res.body.barrelType).to.equal('medium palma');
        expect(res.body.windSpeed).to.equal(12);
        done();
      }).catch(done);
    });
    });
  });



});
