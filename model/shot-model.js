'use strict';

const mongoose = require('mongoose');
// const debug = require('debug')('shooter:shot-model');
// const httpErrors = require('http-errors');

const shotSchema = module.exports = mongoose.shotSchema({
  user_id: {type: mongoose.Schema.ObjectId, required:true},
  match_id: {type: mongoose.Schema.ObjectId, required:true},
  xValue: {type: Boolean, required: true},
  score: {type: String, required: true}
});

module.exports = mongoose.model('shot', shotSchema);
