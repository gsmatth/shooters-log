'use strict';

process.env.APP_SECRET = process.env.APP_SECRET || 'Im a secret!!!!!';
process.env.MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost/db';

// npm
const expect = require('chai').expect;
const request = require('superagent-use');
const superPromise = require('superagent-promise-plugin');
const debug = require('debug')('shooter: score-card test');

const User = require('../model/user-model');
const userController = require('../controller/auth-controller');
const compController = require('../controller/competition-controller');
const matchController = require('../controller/match-controller');
const shotController = require('../controller/shot-controller');
const scoreCardController = require('../controller/score-card-controller');

const port = process.env.PORT || 3000;

const baseUrl = `http://localhost:${port}/api`;
const server = require('../server');
request.use(superPromise);

describe('Testing score-card-route ', function() {

  before((done)=> {
    debug('before module score-card-router');
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
    debug('after module score-card-router');
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
  describe('testing the fillScoreCard route', function(){
    before((done) => { // creating our test resources
      debug('before-block-GET-ALL-SHOTS-bY-match');
      var user = new User({username: 'MrTest', password: 'ye-pass'});
      userController.newUser({username: user.username, password: user.password})
      .then( token => {
        this.tempToken = token;
        compController.createCompetition({
          userId: user._id,
          location: 'test range',
          action: 'to test',
          caliber: '308',
          dateOf: 'May 28 2016'
        })
        .then(competition => {
          this.tempCompetition = competition;
          console.log('this.tempCompetition', this.tempCompetition, 'this.tempCompetition.userId', this.tempCompetition.userId);
          matchController.createMatch(this.tempCompetition._id, {
            competitionId: this.tempCompetition._id,
            userId       :this.tempCompetition.userId,
            matchNumber: 1,
            targetNumber: 4,
            distanceToTarget: 600,
            relay: 1
          })
          .then(match => {
            this.tempMatch = match;
            console.log('this.tempMatch', this.tempMatch);
            shotController.createShot({
              userId:`${this.tempMatch.userId}` ,
              matchId: `${this.tempMatch._id}`,
              xValue: true,
              score: '10',
              dateOf: 'May 38 2016'
            })
            .then(shot => {
              this.tempShot = shot;
              console.log('THIS NEW SHOT I MADE:', this.tempShot);
              done();
            })
            .catch(done);
          })
          .catch(done);
        })
        .catch(done);
      })
      .catch(done);
    });

    after((done)=>{
      debug('ET-EVERYTHING by comp ID after-block');
      Promise.all([
        compController.removeAllCompetition(),
        matchController.removeAllMatches(),
        userController.removeAllUsers(),
        shotController.removeAllShots()
      ])
      .then(() => done())
      .catch(done);
    });

    it('should return a competition and 3 matches', (done) => {
      debug('match GET-EVERYTHING by comp ID route with valid data');
      request.get(`${baseUrl}/competition/${this.tempCompetition._id}/all`)
      .set({Authorization: `Bearer ${this.tempToken}`})
      .then((res) => {
        expect(res.status).to.equal(200);
        done();
      }).catch(done);
    });
  })
});
