'use strict';

const debug = require('debug')('shooter:match');
const mongoose = require('mongoose');

const matchSchema = module.exports = mongoose.Schema({
  useId: {type: mongoose.Schema.ObjectId, required: true},
  competionId: {type: mongoose.Schema.ObjectId, required: true},
  matchNumber: {type: Number, unique: true}
});

module.exports = mongoose.model('match', matchSchema);
