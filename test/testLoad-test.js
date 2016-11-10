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
    bulletName:        'bullety',
    bulletWeight:      3,
    bulletCaliber:     30,
    primeManufacturer: 'Wondermins',
    primeModel:        'The Wonder Primer',
    dateCreated:       1477516154057,
    time:              '8:00 PM',
    temperature:       '75°',
    humidity:          '60%',
    notes:             'this bullet makes me sad :('
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
        loadId: load._id,
        powderName: 'The Bullet Maker',
        powderWeight: 500,
        OAL: 40,
        testShots: [
          {shotId: '26363527acacaca64536fecf', muzzleVelocity: 2500},
          {shotId: '76363527abf12ca62336fecf', muzzleVelocity: 2400},
          {shotId: 'db3ff527abf12ca62336fe65', muzzleVelocity: 2200}
        ],
        groupSize: 12
      })
      .set({Authorization: `Bearer ${this.tempToken}`})
      .then(res => {
        expect(res.status).to.equal(200);
        expect(res.body.testShots[0].shotId).to.equal('26363527acacaca64536fecf');
        expect(res.body.testShots[0].muzzleVelocity).to.equal(2500);
        done();
      })
      .catch(done);
    });
  });

  describe('testing testLoad get route', ()=> {
    before((done) => {
      debug('testLoad-get-before-block');
      userController.newUser({username: user.username, password: user.password, firstName: user.firstName, lastName: user.lastName})
      .then( token => {
        this.tempToken = token;
        testLoadController.createTestLoad({
          userId: user._id,
          loadId: load._id,
          powderName: 'Bullet Powder',
          powderWeight: 400,
          OAL: 60,
          testShots: [
            {shotId: '26363527acacaca64536fecf', muzzleVelocity: 4000},
            {shotId: '76363527abf12ca62336fecf', muzzleVelocity: 3500},
            {shotId: 'db3ff527abf12ca62336fe65', muzzleVelocity: 3600}
          ],
          groupSize: 10
        }).then(testLoad => {
          this.tempTestLoad = testLoad;
          done();
        })
        .catch(done);
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

    it('should return a testLoad', (done) => {
      debug('GET-test');
      request.get(`${baseUrl}/user/load/testload/${this.tempTestLoad._id}`)
      .set({Authorization: `Bearer ${this.tempToken}`})
      .then(res => {
        expect(res.status).to.equal(200);
        expect(res.body.powderName).to.equal('Bullet Powder');
        expect(res.body.testShots[0].shotId).to.equal('26363527acacaca64536fecf');
        expect(res.body.testShots[0].muzzleVelocity).to.equal(4000);
        done();
      })
      .catch(done);
    });
  });

  describe('testing the getAllTestLoads route', () => {
    before((done) => {
      debug('testLoad-getAll-before-block');
      userController.newUser({
        username: 'test', password: 'testing', firstName: 'something', lastName: 'somethingelse'
      })
      .then(token => {
        this.tempToken = token;
        Promise.all([
          request.post( `${baseUrl}/user/load/testload`)
          .set({Authorization: `Bearer ${this.tempToken}`})
          .send({
            loadId: load._id,
            powderName: 'A Bullets best friend',
            powderWeight: 350,
            OAL: 600,
            testShots: [
              {shotId: '26363527acacaca64536febs', muzzleVelocity: 3400},
              {shotId: '76363527abf12ca62336fe11', muzzleVelocity: 3200},
              {shotId: 'db3ff527abf12ca62336fe47', muzzleVelocity: 3100}
            ],
            groupSize: 8
          }),
          request.post(`${baseUrl}/user/load/testload`)
          .set({Authorization: `Bearer ${this.tempToken}`})
          .send({
            loadId: load._id,
            powderName: 'Pew Pew Powder',
            powderWeight: 400,
            OAL: 700,
            testShots: [
              {shotId: '26363527acacaca64536feab', muzzleVelocity: 2400},
              {shotId: '76363527abf12ca62336fefc', muzzleVelocity: 3000},
              {shotId: 'db3ff527abf12ca62336fe45', muzzleVelocity: 2800}
            ],
            groupSize: 10
          })
        ])
        .then(testLoadInfo => {
          console.log(testLoadInfo[0].body);
          console.log(testLoadInfo[1].body);
          this.tempTestLoad1 = testLoadInfo[0];
          this.tempTestLoad2 = testLoadInfo[1];
          done();
        })
        .catch(done);
      })
      .catch(done);
    });

    after((done) => {
      debug('testLoad-all-GET-test-after-block');
      Promise.all([
        userController.removeAllUsers(),
        testLoadController.removeAllTestLoads()
      ]).then(() => done())
      .catch(done);
    });

    it('should fetch all test loads by loadId', (done) => {
      debug('GET-all-test');
      request.get(`${baseUrl}/user/load/testloads/${load._id}`)
      .set({Authorization: `Bearer ${this.tempToken}`})
      .then(res => {
        expect(res.status).to.equal(200);
        expect(res.body.length).to.equal(2);
        done();
      })
      .catch(done);
    });
  });

  describe('testing testLoad put route', ()=> {
    before((done) => {
      debug('testLoad-PUT-test-before-block');
      userController.newUser({username: user.username, password: user.password, firstName: user.firstName, lastName: user.lastName})
      .then( token => {
        this.tempToken = token;
        testLoadController.createTestLoad({
          userId: user._id,
          loadId: load._id,
          powderName: 'A Bullets best friend',
          powderWeight: 350,
          OAL: 600,
          testShots: [
            {shotId: '26363527acacaca64536fecf', muzzleVelocity: 3400},
            {shotId: '76363527abf12ca62336fecf', muzzleVelocity: 3200},
            {shotId: 'db3ff527abf12ca62336fe65', muzzleVelocity: 3100}
          ],
          groupSize: 8
        }).then(testLoad => {
          this.tempTestLoad = testLoad;
          done();
        })
        .catch(done);
      })
      .catch(done);
    });

    after((done) => {
      debug('testLoad-PUT-test-after-block');
      Promise.all([
        userController.removeAllUsers(),
        testLoadController.removeAllTestLoads()
      ]).then(() => done())
      .catch(done);
    });

    it('should update and return a testLoad', (done) => {
      debug('PUT-test');
      request.put(`${baseUrl}/user/load/testload/${this.tempTestLoad._id}`)
      .send({
        testShots: [
          {shotId: '26363527acacaca64456fecf', muzzleVelocity: 3600},
          {shotId: '76363527abf12ca62466fecf', muzzleVelocity: 3300},
          {shotId: 'db3ff527abf12ca62476fe65', muzzleVelocity: 3000},
          {shotId: 'db3ff527abf12ca62486fe65', muzzleVelocity: 3400}
        ]
      })
      .set({Authorization: `Bearer ${this.tempToken}`})
      .then(res => {
        expect(res.status).to.equal(200);
        expect(res.body.testShots[3].shotId).to.equal('db3ff527abf12ca62486fe65');
        expect(res.body.testShots[3].muzzleVelocity).to.equal(3400);
        done();
      })
      .catch(done);
    });
  });

  describe('testing testLoad delete route', ()=> {
    before((done) => {
      debug('testLoad-DELETE-test-before-block');
      userController.newUser({username: user.username, password: user.password, firstName: user.firstName, lastName: user.lastName})
      .then( token => {
        this.tempToken = token;
        testLoadController.createTestLoad({
          userId: user._id,
          loadId: load._id,
          powderName: 'Powderface',
          powderWeight: 375,
          OAL: 650,
          testShots: [
            {shotId: '26363527acacaca64536fecf', muzzleVelocity: 3400},
            {shotId: '76363527abf12ca62336fecf', muzzleVelocity: 3200},
            {shotId: 'db3ff527abf12ca62336fe65', muzzleVelocity: 3100}
          ],
          groupSize: 6
        }).then(testLoad => {
          this.tempTestLoad = testLoad;
          done();
        })
        .catch(done);
      })
      .catch(done);
    });

    after((done) => {
      debug('testLoad-DELETE-test-after-block');
      Promise.all([
        userController.removeAllUsers(),
        testLoadController.removeAllTestLoads()
      ]).then(() => done())
      .catch(done);
    });

    it('should delete a testLoad', (done) => {
      debug('DELETE-test');
      request.del(`${baseUrl}/user/load/testload/${this.tempTestLoad._id}`)
      .set({Authorization: `Bearer ${this.tempToken}`})
      .then(res => {
        expect(res.status).to.equal(204);
        expect(res.body._id).to.equal(undefined);
        done();
      })
      .catch(done);
    });
  });
});
