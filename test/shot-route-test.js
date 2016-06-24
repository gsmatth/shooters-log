'use strict';

process.env.APP_SECRET = process.env.APP_SECRET || 'Im a secret!!!!!';
process.env.MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost/test';

// npm
const expect = require('chai').expect;
const request = require('superagent-use');
const superPromise = require('superagent-promise-plugin');
const debug = require('debug')('shooter:shot-route-test');

//const Shot = require('../model/shot-model');
//const User = require('../model/user-model');
const authController = require('../controller/auth-controller');
const compController = require('../controller/competition-controller');
const shotController = require('../controller/shot-controller');
const matchController = require('../controller/match-controller');

const port = process.env.PORT || 3000;

const baseUrl = `localhost:${port}/api`;
const server = require('../server');
request.use(superPromise);

describe('Testing shot-route ', function() {

  before((done)=> {
    debug('before module shot-router');
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
    debug('after module shot-router');
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

  describe('testing POST shot route with valid  user, match, and competition', function(){

    before((done) => { // create token for authorization needed for post
      debug('shot-POST-route-test-before-block');
      authController.newUser({username: user.username, password: user.password})
      .then( token => {
        this.tempToken = token;
        done();
      })
      .catch(done);
    });

    after((done)=>{
      debug('shot-POST-route-test-after-block');
      Promise.all([
        shotController.removeAllShots(),
        authController.removeAllUsers()
      ])
      .then(() => done())
      .catch(done);
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
    var shotData = {
      userId:'576c47d854d007350a734560' ,
      matchId: '576c4f19965f8a8a0ab5397f',
      xValue: true,
      score: '10'
    };


    it('should should return a new score object in response', (done) => {
      debug('shot-POST-route-test-it-block');
      request.post(`${baseUrl}/competition/${competition._id}/match/${match._id}/shot`)
      .send(shotData)
      .set({Authorization: `Bearer ${this.tempToken}`})
      .then((res) => {
        expect(res.status).to.equal(200);
        expect(res.body.xValue).to.equal(true);
        expect(res.body.score).to.equal('10');
        console.log('\nSCORE RES BODY: \n \n', res.body);
        done();
      })
      .catch(done);
    });
  });

  describe('testing GET shot route with valid shotId', function(){

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
    // var shotData = {
    //   userId:'576c47d854d007350a734560' ,
    //   matchId: '576c4f19965f8a8a0ab5397f',
    //   xValue: false,
    //   score: 'M'
    // };

    before((done) => { // create token for authorization needed for post
      debug('shot-GET-route-test-before-block');
      authController.newUser({username: user.username, password: user.password})
      .then( token => {
        this.tempToken = token;
        console.log('\n GET TOKEN: \n', this.tempToken);
        shotController.createShot({
          userId: '576c47d854d007350a734560',
          matchId: '576c4f19965f8a8a0ab5397f',
          xValue: false,
          score: '9'
        })
        .then(shot => {
          console.log(shot);
          this.tempShot = shot;
          console.log(this.tempShot);
          done();
        }).catch(done);
      });
    });

    //     compController.createCompetition({
    //       userId: user._id,
    //       location: 'test range',
    //       action: 'to test'
    //     })
    //     .then(competition => {
    //       this.tempCompetition = competition;
    //       console.log('this.tempCompetition', this.tempCompetition, 'this.tempCompetition.userId', this.tempCompetition.userId);
    //       matchController.createMatch(this.tempCompetition._id, {
    //         competitionId: this.tempCompetition._id,
    //         userId       :this.tempCompetition.userId,
    //         matchNumber  : 1
    //       })
    //       .then(match => {
    //         console.log('THIS! Match', match);
    //         this.tempMatch = match;
    //         shotController.createShot({
    //           userId: user._id,
    //           matchId: this.tempMatch._id,
    //           xValue: false,
    //           score: '9'
    //         })
    //         .then(shot => {
    //           console.log('\n SHOT: \n', shot);
    //           this.tempShot = shot;
    //           console.log('\n TEMP SHOT: \n', this.tempShot);
    //           done();
    //         }).catch(done);
    //       }).catch(done);
    //     }).catch(done);
    //   }).catch(done);
    // });

    after((done)=>{
      debug('shot-GET-route-test-after-block');
      Promise.all([
        shotController.removeAllShots(),
        authController.removeAllUsers(),
        compController.removeAllCompetition(),
        matchController.removeAllMatches()
      ])
      .then(() => done())
      .catch(done);
    });

    it('should should return an existing score object in response', (done) => {
      debug('shot-GET-route-test-it-block');
      request.get(`${baseUrl}/competition/${competition._id}/match/${match._id}/shot/${this.tempShot._id}`)
      .set({Authorization: `Bearer ${this.tempToken}`})
      .then((res) => {
        expect(res.status).to.equal(200);
        console.log(res.body);
        // expect(res.body.xValue).to.equal(false);
        // expect(res.body.score).to.equal('M');
        console.log('\nSCORE RES BODY: \n \n', res.body);
        done();
      })
      .catch(done);
    });
  });
});
