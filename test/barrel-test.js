'use strict';

process.env.APP_SECRET = process.env.APP_SECRET || 'Im a secret!!!!!';
process.env.MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost/test';

// npm
const expect = require('chai').expect;
const request = require('superagent-use');
const superPromise = require('superagent-promise-plugin');
const debug = require('debug')('shooter: barrel-test');

// const Barrel = require('../model/barrel-model');
const barrelController = require('../controller/barrel-controller');
const userController = require('../controller/auth-controller');
// const compController = require('../controller/competition-controller');
// const matchController = require('../controller/match-controller');
// const rifleController = require('../controller/rifle-controller');
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

  var user = {
    _id: '576c47d854d007350a734560',
    password: '$2a$09$4zNSZ5AtttLPnjs8KaXpaur4aRucsAqesMqSLe0wt4fXL.X7fDb1C',
    username: 'McTest',
    findHash: 'f517531581cb0323dea580d7c0016a79812e7ffa3790f04786ee836d2fac1822'
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
    _id: '576c4f19965f8a8a0ab3d367'
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



  describe('POST barrel with userId.  ', () => {
    before((done) => {
      debug('barrel-post-test-before-block');
    // var user = new User({username: 'McTest', password: 'pass'});
      userController.newUser({username: user.username, password: user.password})
      .then( token => {
        this.tempToken = token;
        done();
      })
        .catch(done);
    });

    after((done) => {
      debug('barrel-post-test-after-block');
      Promise.all([
        userController.removeAllUsers()
      ])
      .then(() => done())
      .catch(done);
    });

    it('should return a barrel response', (done) => {
      request.post(`${baseUrl}/user/${user._id}/barrel`)
      .send({
        barrelName: 'mid-range F-TR',
        barrelManufacturer: 'Kreiger',
        barrelType: 'medium palma',
        barrelTwist: '1:10',
        barrelLength: 30,
        barrelLife: 3500,
        barrelCaliber: 30,
        roundCount: 1700,
        userId: user._id,
        matchId: match._id,
        competitionId: competition._id,
        rifleId: rifle._id
      })
      .set({Authorization: `Bearer ${this.tempToken}`})
      .then((res) => {
        expect(res.status).to.equal(200);
        expect(res.body.barrelManufacturer).to.equal('Kreiger');
        expect(res.body.barrelLife).to.equal(3500);
        expect(res.body.roundCount).to.equal(1700);
        expect(res.body.barrelType).to.equal('medium palma');
        expect(res.body.userId).to.equal('576c47d854d007350a734560');
        expect(res.body.rifleId).to.equal('576c4f19965f8a8a0ab83402');
        done();
      }).catch(done);
    });
  });


  describe('GET barrel with barrelId. ', () => {
    before((done) => {
      debug('barrel-post-test-before-block');
    // var user = new User({username: 'McTest', password: 'pass'});
      userController.newUser({username: user.username, password: user.password})
      .then( token => {
        this.tempToken = token;
        barrelController.createBarrel({
          barrelName: 'mid-range F-TR',
          barrelManufacturer: 'Kreiger',
          barrelType: 'medium palma',
          barrelTwist: '1:10',
          barrelLength: 30,
          barrelLife: 3500,
          barrelCaliber: 30,
          roundCount: 1700,
          userId: user._id,
          matchId: match._id,
          competitionId: competition._id,
          rifleId: rifle._id
        })
        .then(barrel => {
          this.tempBarrel = barrel;
          done();
        })
      .catch(done);
      })
    .catch(done);
    });

    after((done) => {
      debug('barrel-get-test-after-block');
      Promise.all([
        userController.removeAllUsers()
      ])
      .then(() => done())
      .catch(done);
    });

    it('should return a barrel response', (done) => {
      debug('barrel-get-test-it-block');
      console.log('\nthis.tempbarrel\n', this.tempBarrel._id);
      request.get(`${baseUrl}/user/${user._id}/barrel/${this.tempBarrel._id}`)
      .set({Authorization: `Bearer ${this.tempToken}`})
      .then((res) => {
        expect(res.status).to.equal(200);
        expect(res.body.barrelManufacturer).to.equal('Kreiger');
        expect(res.body.barrelLife).to.equal(3500);
        expect(res.body.roundCount).to.equal(1700);
        expect(res.body.barrelType).to.equal('medium palma');
        expect(res.body.userId).to.equal('576c47d854d007350a734560');
        expect(res.body.rifleId).to.equal('576c4f19965f8a8a0ab83402');
        done();
      }).catch(done);
    });
  });

  describe('DELETE barrel with barrelId. ', () => {
    before((done) => {
      debug('barrel-delete-test-before-block');
    // var user = new User({username: 'McTest', password: 'pass'});
      userController.newUser({username: user.username, password: user.password})
      .then( token => {
        this.tempToken = token;
        barrelController.createBarrel({
          barrelName: 'mid-range F-TR',
          barrelManufacturer: 'Kreiger',
          barrelType: 'medium palma',
          barrelTwist: '1:10',
          barrelLength: 30,
          barrelLife: 3500,
          barrelCaliber: 30,
          roundCount: 1700,
          userId: user._id,
          matchId: match._id,
          competitionId: competition._id,
          rifleId: rifle._id
        })
        .then(barrel => {
          this.tempBarrel = barrel;
          done();
        })
      .catch(done);
      })
    .catch(done);
    });

    after((done) => {
      debug('barrel-get-test-after-block');
      Promise.all([
        userController.removeAllUsers()
      ])
      .then(() => done())
      .catch(done);
    });

    it('should return a status of 204', (done) => {
      debug('barrel-delete-test-it-block');
      console.log('\nthis.tempbarrel\n', this.tempBarrel._id);
      request.del(`${baseUrl}/user/${user._id}/barrel/${this.tempBarrel._id}`)
      .set({Authorization: `Bearer ${this.tempToken}`})
      .then((res) => {
        expect(res.status).to.equal(204);
        done();
      }).catch(done);
    });
  });



  describe('PUT barrel with userId.  ', () => {
    before((done) => {
      debug('barrel-delete-test-before-block');
    // var user = new User({username: 'McTest', password: 'pass'});
      userController.newUser({username: user.username, password: user.password})
      .then( token => {
        this.tempToken = token;
        barrelController.createBarrel({
          barrelName: 'mid-range F-TR',
          barrelManufacturer: 'Kreiger',
          barrelType: 'medium palma',
          barrelTwist: '1:10',
          barrelLength: 30,
          barrelLife: 3500,
          barrelCaliber: 30,
          roundCount: 1700,
          userId: user._id,
          matchId: match._id,
          competitionId: competition._id,
          rifleId: rifle._id
        })
        .then(barrel => {
          this.tempBarrel = barrel;
          done();
        })
      .catch(done);
      })
    .catch(done);
    });

    after((done) => {
      debug('barrel-put-test-after-block');
      Promise.all([
        userController.removeAllUsers()
      ])
      .then(() => done())
      .catch(done);
    });

    it('should return an updated barrel', (done) => {
      console.log('\n\nthis.tempbarrel._id added to reqparams of put request\n\n', this.tempBarrel._id);
      request.put(`${baseUrl}/user/${user._id}/barrel/${this.tempBarrel._id}`)
      .send({
        barrelName: 'CMP Palma',
        barrelManufacturer: 'Kreiger',
        barrelType: 'heavy palma',
        barrelTwist: '1:12',
        barrelLength: 28,
        barrelLife: 3500,
        barrelCaliber: 30,
        roundCount: 500,
        userId: user._id,
        matchId: match._id,
        competitionId: competition._id,
        rifleId: rifle._id
      })
      .set({Authorization: `Bearer ${this.tempToken}`})
      .then((res) => {
        expect(res.status).to.equal(200);
        expect(res.body.barrelName).to.equal('CMP Palma');
        expect(res.body.barrelManufacturer).to.equal('Kreiger');
        expect(res.body.barrelLife).to.equal(3500);
        expect(res.body.roundCount).to.equal(500);
        expect(res.body.barrelType).to.equal('heavy palma');
        expect(res.body.userId).to.equal('576c47d854d007350a734560');
        expect(res.body.rifleId).to.equal('576c4f19965f8a8a0ab83402');
        done();
      }).catch(done);
    });
  });

});
