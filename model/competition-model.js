'use strict';

// const debug = require('debug')('shooter:competition-model');
const mongoose = require('mongoose');

const competitionSchema = mongoose.Schema({
  location: {type: String, required: true},
  action: {type: String, required: true},
  userId: {type: mongoose.Schema.ObjectId, required:true}
});

module.exports = mongoose.model('competition', competitionSchema );
