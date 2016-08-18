'use strict';

const mongoose = require('mongoose');

const shotSchema = module.exports = mongoose.Schema({
  userId: {type: mongoose.Schema.ObjectId, required:true},
  matchId: {type: mongoose.Schema.ObjectId, required:true},
  xValue: {type: Boolean, required: true},
  score: {type: String, required: true},
  dateOf: {type: String},
  shotNumber: {type: Number},
  polarCoords: {type: Array},
  cartesianCoords: {type: Array},
  elevation: {type: Number},
  windage: {type: Number},
  practice: {type: Boolean},
  sighter: {type: Boolean},
  record: {type: Boolean}
});

module.exports = mongoose.model('shot', shotSchema);
