'use strict';

const mongoose = require('mongoose');

const competitionSchema = mongoose.Schema({
  location: {type: String, required: true},
  action: {type: String, required: true},
  userId: {type: mongoose.Schema.ObjectId, required:true},
  caliber: {type: Number, required:true},
  dateOf: {type: String}
});

module.exports = mongoose.model('competition', competitionSchema );
