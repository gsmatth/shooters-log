'use strict';

const httpErrors = require('http-errors');
const debug = require('debug')('shooter:handle-errors');


module.exports = function(err, req, res, next) {
  console.error(err.message);
  if(err.status && err.name) {
    debug('http-errors');
    res.status(err.status).send(err.name);
    next();
    return;
  }
  debug('server error');
  err = httpErrors(500, err.message);
  res.status(err.status).send(err.name);
};
