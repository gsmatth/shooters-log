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
const loadController = require('../controller/load-controller');

const port = process.env.PORT || 3000;

const baseUrl = `http://localhost:${port}/api`;
const server = require('../server');
request.use(superPromise);

describe('testing our load model', function() {
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
  var shot = {
    _id: '26363527acacaca64536fecf',
    matchId: '576c4f19965f8a8a0ab5397f',
    xValue: 'false',
    score: '7',
    dateOf: 'June 30 2016'
  };
  var rifle = {
    _id: '576c4f19965f8a8a0ab83402',
    rifleName: 'Ol Betsy',
    rifleAction: 'Remington',
    rifleCategory: 'F-TR',
    matchId: '576c4f19965f8a8a0ab5397f',
    competitionId: '576c4a4011d3f63f0a05d475',
    userId: '576c47d854d007350a734560',
    barrelId: 'none'
  };
  var barrel = {
    _id: '4a8df9ae4c23c757e02c2e23',
    barrelName: 'fake name',
    barrelManufacturer: 'fake manufacturer',
    barrelType: 'I have no idea',
    barrelTwist: '1:10',
    barrelLife: 5,
    barrelCaliber: 78,
    roundCount: 3,
    matchId: '576c4f19965f8a8a0ab5397f',
    competitionId: '576c4a4011d3f63f0a05d475',
    userId: '576c47d854d007350a734560',
    rifleId: '576c4f19965f8a8a0ab83402'
  };


  describe('testing load POST route', () => {
    before((done) => {
      debug('load-post-test-before-block');
      userController.newUser({username: user.username, password: user.password, firstName: user.firstName, lastName: user.lastName})
      .then( token => {
        this.tempToken = token;
        done();
      })
        .catch(done);
    });

    after((done) => {
      debug('load-POST-test-after-block');
      Promise.all([
        userController.removeAllUsers(),
        loadController.removeAllLoads()
      ]).then(() => done())
      .catch(done);
    });

    it('should create and return a load', (done) => {
      debug('POST-test');
      request.post(`${baseUrl}/user/${user._id}/load`)
      .send({
        userId:            user._id,
        competitionId:     competition._id,
        matchId:           match._id,
        barrelId:          barrel._id,
        rifleId:           rifle._id,
        shotId:            shot._id,
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
      })
      .set({Authorization: `Bearer ${this.tempToken}`})
      .then(res => {
        expect(res.status).to.equal(200);
        expect(res.body.brassManufacturer).to.equal('brass person');
        expect(res.body.powderName).to.equal('some powder');
        expect(res.body.powderWeight).to.equal(5);
        done();
      }).catch(done);
    });
  });

  describe('testing load GET request', () => {
    before((done) => {
      debug('load-get-test-before-block');
      userController.newUser({username: user.username, password: user.password, firstName: user.firstName, lastName: user.lastName})
      .then(token => {
        this.tempToken = token;
        loadController.createLoad({
          userId:            user._id,
          competitionId:     competition._id,
          matchId:           match._id,
          barrelId:          barrel._id,
          rifleId:           rifle._id,
          shotId:            shot._id,
          brassManufacturer: 'brassyMcBrassface',
          muzzleVelocity:    500
        }).then((load) => {
          this.tempLoadId = load._id;
          done();
        })
        .catch(done);
      })
      .catch(done);
    });

    after((done) => {
      debug('load-get-test-after-block');
      Promise.all([
        loadController.removeAllLoads(),
        userController.removeAllUsers()
      ]).then(() => done())
      .catch(done);
    });

    it('should return a load', (done) => {
      debug('GET-test');
      request.get(`${baseUrl}/user/${user._id}/load/${this.tempLoadId}`)
      .set({Authorization: `Bearer ${this.tempToken}`})
      .then(res => {
        expect(res.status).to.equal(200);
        expect(res.body.brassManufacturer).to.equal('brassyMcBrassface');
        expect(res.body.muzzleVelocity).to.equal(500);
        expect(res.body.OAL).to.equal(undefined);
        done();
      })
      .catch(done);
    });
  });

  describe('testing load PUT request', () => {
    before((done) => {
      debug('load-put-test-before-block');
      userController.newUser({username: user.username, password: user.password, firstName: user.firstName, lastName: user.lastName})
      .then(token => {
        this.tempToken = token;
        loadController.createLoad({
          userId:            user._id,
          competitionId:     competition._id,
          matchId:           match._id,
          barrelId:          barrel._id,
          rifleId:           rifle._id,
          shotId:            shot._id,
          brassManufacturer: 'brassyMcBrassface',
          powderWeight:      80,
          muzzleVelocity:    500
        }).then((load) => {
          this.tempLoadId = load._id;
          done();
        })
        .catch(done);
      })
      .catch(done);
    });

    after((done) => {
      debug('load-put-test-after-block');
      Promise.all([
        loadController.removeAllLoads(),
        userController.removeAllUsers()
      ]).then(() => done())
      .catch(done);
    });

    it('should update an existing load', (done) => {
      debug('PUT test');
      request.put(`${baseUrl}/user/${user._id}/load/${this.tempLoadId}`)
      .send({
        powderWeight: 60,
        muzzleVelocity: 450
      })
      .set({Authorization: `Bearer ${this.tempToken}`})
      .then(res => {
        expect(res.status).to.equal(200);
        expect(res.body.powderWeight).to.equal(60);
        expect(res.body.muzzleVelocity).to.equal(450);
        done();
      })
      .catch(done);
    });
  });
});
