'use strict';
//DEBUG=auth* node server.js
//npm modules
const express = require('express');
const morgan = require('morgan');
const debug = require('debug')('shooter:server');
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

//app modules
const httpErrors = require('http-errors');
const handleErrors = require('./lib/handle-errors');
const authRouter = require('./route/auth-router');
const userRouter = require('./route/user-router');
const competitionRouter = require('./route/competition-router');
const matchRouter = require('./route/match-router');
const shotRouter = require('./route/shot-router');
const scorecardRouter = require('./route/scorecard-router')
// const userRouter = require('./route/user-router');

//module constants
const app = express();
const port = process.env.PORT || 3000;
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost/db';


mongoose.connect(mongoURI);

app.use(morgan('dev'));
// app.use('/api', userRouter);

app.use('/api', authRouter);
app.use('/api', userRouter);
app.use('/api', competitionRouter);
app.use('/api', matchRouter);
app.use('/api', shotRouter);
app.use('/api', scorecardRouter);

app.all('*', function(req, res, next){
  debug('entered app.all route in server.js:  this route is not registered');
  next(httpErrors(404, 'this route is not registered'));
});

app.use(handleErrors);

const server = app.listen(port, function(){
  debug('listen');
  debug('express app up on port: ', port);
});

server.isRunning = true;
module.exports = server;
