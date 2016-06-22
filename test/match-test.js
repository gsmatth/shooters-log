'use strict';

process.env.APP_SECRET = process.env.APP_SECRET || 'Im a secret!!!!!';
process.env.MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost/db';

// npm
const expect = require('chai').expect;
const request = require('superagent-use');
const superPromise = require('superagent-promise-plugin');
const debug = require('debug')('shooter: match test');

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
  describe('testing POST route removeAllMatches', function(){
    after((done)=>{
      debug('POST-after-block');
      matchController.removeAllMatches()
      .then(() => done())
      .catch(done);
    });
    it('should return a match', function(done){
      debug('match POST route');
      request.post()
    })
  })
});
