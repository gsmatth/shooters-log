'use strict';

process.env.APP_SECRET = process.env.APP_SECRET || 'Im a secret!!!!!';
process.env.MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost/test';

// npm
const expect = require('chai').expect;
const request = require('superagent-use');
const superPromise = require('superagent-promise-plugin');
const debug = require('debug')('shooter: match test');

// application modules
const userController = require('../controller/auth-controller');
const rifleController = require('../controller/rifle-controller');
const compController = require('../controller/competition-controller');
const matchController = require('../controller/match-controller');

const port = process.env.PORT || 3000;

const baseUrl = `http://localhost:${port}/api`;
const server = require('../server');
request.use(superPromise);

describe('testing our rifle model', function() {
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
    firstName: 'Billy',
    lastName: 'Smith'
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
  var barrel = {
    _id:'576c47d854d007350a734560'
  };

  describe('testing the rifle POST route', function() {
    before((done) => {
      debug('rifle-post-test-before-block');
      userController.newUser({username: user.username, password: user.password, firstName: user.firstName, lastName: user.lastName})
      .then(token => {
        this.tempToken = token;
        done();
      }).catch(done);
    });

    after((done) => {
      debug('rifle-post-test-after-block');
      Promise.all([
        compController.removeAllCompetition(),
        rifleController.removeAllRifles(),
        matchController.removeAllMatches(),
        userController.removeAllUsers()
      ]).then(() => done())
      .catch(done);
    });

    it('should return a rifle', (done) => {
      debug('post-test');
      request.post(`${baseUrl}/user/${user._id}/rifle`)
      .send({
        rifleName: 'Ol Betsy',
        rifleAction: 'Remington',
        rifleCategory: 'FTR',
        matchId: match._id,
        competitionId: competition._id,
        userId: user._id,
        barrelId: barrel._id
      }).set({Authorization: `Bearer ${this.tempToken}`})
      .then((res) => {
        expect(res.status).to.equal(200);
        expect(res.body.rifleName).to.equal('Ol Betsy');
        expect(res.body.rifleAction).to.equal('Remington');
        expect(res.body.rifleCategory).to.equal('FTR');
        done();
      }).catch(done);
    });

    it('should return a 400 with a bad request', (done) => {
      debug('post-400-test');
      request.post(`${baseUrl}/user/${user._id}/rifle`)
      .send({})
      .set({Authorization: `Bearer ${this.tempToken}`})
      .then(done)
      .catch((err) => {
        try {
          const res = err.response;
          expect(res.status).to.equal(400);
          done();
        } catch (err) {
          done(err);
        }
      });
    });

    it('should return a 401 when Unauthorized', (done) => {
      debug('post-401-test');
      request.post(`${baseUrl}/user/${user._id}/rifle`)
      .send({
        rifleName: 'Debra',
        rifleAction: 'Remington',
        rifleCategory: 'FTR',
        matchId: match._id,
        competitionId: competition._id,
        userId: user._id,
        barrelId: barrel._id
      }).set({})
      .then(done)
      .catch((err) => {
        try {
          const res = err.response;
          expect(res.status).to.equal(401);
          done();
        } catch (err) {
          done(err);
        }
      });
    });
  });

  describe('testing the rifle GET route', function() {
    before((done) => {
      debug('rifle-get-test-before-block');
      userController.newUser({username: user.username, password: user.password, firstName: user.firstName, lastName: user.lastName})
      .then(token => {
        this.tempToken = token;
        rifleController.createRifle({
          rifleName: 'Shooter McGavin',
          rifleAction: 'Remington',
          rifleCategory: 'sling',
          matchId: match._id,
          competitionId: competition._id,
          userId: user._id,
          barrelId: barrel._id
        }).then(rifle => {
          this.tempRifle = rifle;
          done();
        }).catch(done);
      }).catch(done);
    });

    after((done) => {
      debug('rifle-get-test-after-block');
      Promise.all([
        compController.removeAllCompetition(),
        rifleController.removeAllRifles(),
        matchController.removeAllMatches(),
        userController.removeAllUsers()
      ]).then(() => done())
      .catch(done);
    });

    it('should return a rifle', (done) => {
      debug('get-rifle-test');
      request.get(`${baseUrl}/user/${user._id}/rifle/${this.tempRifle._id}`)
      .set({Authorization: `Bearer ${this.tempToken}`})
      .then(res => {
        expect(res.status).to.equal(200);
        expect(res.body.rifleName).to.equal('Shooter McGavin');
        expect(res.body.rifleAction).to.equal('Remington');
        expect(res.body.rifleCategory).to.equal('sling');
        done();
      }).catch(done);
    });

    it('should return a 404 with invalid id', (done) => {
      debug('get-404-test');
      request.get(`${baseUrl}/user/${user._id}/rifle/198723649172364`)
      .set({Authorization: `Bearer ${this.tempToken}`})
      .then(done)
      .catch((err) => {
        try {
          const res = err.response;
          expect(res.status).to.equal(404);
          done();
        } catch (err) {
          done(err);
        }
      });
    });

    it('should return a 401 when Unauthorized', (done) => {
      debug('get-401-test');
      request.get(`${baseUrl}/user/${user._id}/rifle/${this.tempRifle._id}`)
      .set({})
      .then(done)
      .catch((err) => {
        try {
          const res = err.response;
          expect(res.status).to.equal(401);
          done();
        } catch (err) {
          done(err);
        }
      });
    });
  });

  describe('testing the rifle DELETE route', function() {
    before((done) => {
      debug('rifle-delete-test-before-block');
      userController.newUser({username: user.username, password: user.password, firstName: user.firstName, lastName: user.lastName})
      .then(token => {
        this.tempToken = token;
        rifleController.createRifle({
          rifleName: 'Bang Bang',
          rifleAction: 'Defiance',
          rifleCategory: 'FTR',
          matchId: match._id,
          competitionId: competition._id,
          userId: user._id,
          barrelId: barrel._id
        }).then(rifle => {
          this.tempRifle = rifle;
          done();
        }).catch(done);
      }).catch(done);
    });

    after((done) => {
      debug('rifle-get-test-after-block');
      Promise.all([
        compController.removeAllCompetition(),
        rifleController.removeAllRifles(),
        matchController.removeAllMatches(),
        userController.removeAllUsers()
      ]).then(() => done())
      .catch(done);
    });

    it('should delete a rifle', (done) => {
      debug('delete-rifle-test');
      request.del(`${baseUrl}/user/${user._id}/rifle/${this.tempRifle._id}`)
      .set({Authorization: `Bearer ${this.tempToken}`})
      .then(res => {
        expect(res.status).to.equal(204);
        expect(res.body._id).to.equal(undefined);
        done();
      }).catch(done);
    });

    it('should return a 404 with invalid id', (done) => {
      debug('delete-404-test');
      request.del(`${baseUrl}/user/${user._id}/rifle/7234987234`)
      .set({Authorization: `Bearer ${this.tempToken}`})
      .then(done)
      .catch((err) => {
        try {
          const res = err.response;
          expect(res.status).to.equal(404);
          done();
        } catch (err) {
          done(err);
        }
      });
    });

    it('should return a 401 when unauthorized', (done) => {
      debug('delete-401-test');
      request.del(`${baseUrl}/user/${user._id}.rifle/${this.tempRifle._id}`)
      .set({})
      .then(done)
      .catch((err) => {
        try {
          const res = err.response;
          expect(res.status).to.equal(404);
          done();
        } catch (err) {
          done(err);
        }
      });
    });
  });

  describe('testing the PUT route', function() {
    before((done) => {
      debug('rifle-delete-test-before-block');
      userController.newUser({username: user.username, password: user.password, firstName: user.firstName, lastName: user.lastName})
      .then(token => {
        this.tempToken = token;
        rifleController.createRifle({
          rifleName: 'Shooty Shooty McBang',
          rifleAction: 'Remington',
          rifleCategory: 'sling',
          matchId: match._id,
          competitionId: competition._id,
          userId: user._id,
          barrelId: barrel._id
        }).then(rifle => {
          this.tempRifle = rifle;
          done();
        }).catch(done);
      }).catch(done);
    });

    after((done) => {
      debug('rifle-get-test-after-block');
      Promise.all([
        compController.removeAllCompetition(),
        rifleController.removeAllRifles(),
        matchController.removeAllMatches(),
        userController.removeAllUsers()
      ]).then(() => done())
      .catch(done);
    });

    it('should update a rifle', (done) => {
      debug('put-rifle-test');
      request.put(`${baseUrl}/user/${user._id}/rifle/${this.tempRifle._id}`)
      .send({
        rifleName: 'Pew Pew McAccuracy',
        rifleAction: 'Defiance'
      }).set({Authorization: `Bearer ${this.tempToken}`})
      .then(res => {
        expect(res.status).to.equal(200);
        expect(res.body.rifleName).to.equal('Pew Pew McAccuracy');
        expect(res.body.rifleAction).to.equal('Defiance');
        done();
      }).catch(done);
    });

    it('should return a 404 with invalid id', (done) => {
      debug('put-404-test');
      request.put(`${baseUrl}/user/${user._id}/rifle/12313134324`)
      .send({
        rifleName: 'test rifle',
        rifleAction: 'test category'
      }).set({Authorization: `Bearer ${this.tempToken}`})
      .then(done)
      .catch((err) => {
        try {
          const res = err.response;
          expect(res.status).to.equal(404);
          done();
        } catch (err) {
          done(err);
        }
      });
    });

    it('should return a 400 with a bad request', (done) => {
      debug('put-400-test');
      request.put(`${baseUrl}/user/${user._id}/rifle/${this.tempRifle._id}`)
      .send({})
      .set({Authorization: `Bearer ${this.tempToken}`})
      .then(done)
      .catch((err) => {
        try {
          const res = err.response;
          expect(res.status).to.equal(400);
          done();
        } catch (err) {
          done(err);
        }
      });
    });

    it('should return a 401 when unauthorized', (done) => {
      debug('put-401-test');
      request.put(`${baseUrl}/user/${user._id}/rifle/${this.tempRifle._id}`)
      .send({
        rifleName: 'I changed my rifle Name!'
      }).set({})
      .then(done)
      .catch((err) => {
        try {
          const res = err.response;
          expect(res.status).to.equal(401);
          done();
        } catch (err) {
          done (err);
        }
      });
    });
  });
});
