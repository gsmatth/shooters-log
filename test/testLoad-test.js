'use strict';

process.env.APP_SECRET = process.env.APP_SECRET || 'Im a secret!!!!!';
process.env.MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost/test';

// npm
const expect = require('chai').expect;
const request = require('superagent-use');
const superPromise = require('superagent-promise-plugin');
const debug = require('debug')('shooter: load');

// application modules
const userController = require('../controller/auth-controller');
const testLoadController = require('../controller/test-load-controller');

const port = process.env.PORT || 3000;

const baseUrl = `http://localhost:${port}/api`;
const server = require('../server');
request.use(superPromise);

describe('testing our test load', function(){
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
    findHash: 'f517531581cb0323dea580d7c0016a79812e7ffa3790f04786ee836d2fac1822',
    firstName: 'testy',
    lastName: 'testerson'
  };
  var load = {
    _id:               '435aca634253fca45354ff76',
    userId:            user._id,
    competitionId:     '576c4a4011d3f63f0a05d475',
    matchId:           '576c4f19965f8a8a0ab5397f',
    barrelId:          '4a8df9ae4c23c757e02c2e23',
    rifleId:           '576c4f19965f8a8a0ab83402',
    shotId:            '26363527acacaca64536fecf',
    brassManufacturer: 'brass person',
    powderName:        'some powder',
    powderWeight:      5,
    bulletName:        'bullety',
    bulletWeight:      3,
    bulletCaliber:     30,
    OAL:               50,
    primeManufacturer: 'primerMaker',
    primeModel:        'primerType',
    muzzleVelocity:    500
  };

  describe('testing testLoad post route', ()=> {
    before((done) => {
      debug('testLoad-post-test-before-block');
      userController.newUser({username: user.username, password: user.password, firstName: user.firstName, lastName: user.lastName})
      .then( token => {
        this.tempToken = token;
        done();
      })
        .catch(done);
    });

    after((done) => {
      debug('testLoad-POST-test-after-block');
      Promise.all([
        userController.removeAllUsers(),
        testLoadController.removeAllTestLoads()
      ]).then(() => done())
      .catch(done);
    });

    it('should create and return a test load', (done)=> {
      debug('POST-test');
      request.post(`${baseUrl}/user/load/testload`)
      .send({
        userId: user._id,
        loadId: load._id,
        testShots: [
          5,
          10,
          8
        ]
      })
      .set({Authorization: `Bearer ${this.tempToken}`})
      .then(res => {
        expect(res.status).to.equal(200);
        expect(res.body.userId).to.equal('576c47d854d007350a734560');
        expect(res.body.testShots[0]).to.equal(5);
        done();
      })
      .catch(done);
    });
  });
});
