'use strict';

const mongoose = require('mongoose');

const rifleSchema = module.exports = mongoose.Schema({
  rifleName: {type: String, required: true},
  rifleAction: {type: String, required: true},
  rifleCategory: {type: String, required: true},
  matchId: {type: mongoose.Schema.ObjectId},
  competitionId: {type: mongoose.Schema.ObjectId},
  userId: {type: mongoose.Schema.ObjectId},
  barrelId: {type: mongoose.Schema.ObjectId}
});

module.exports = mongoose.model('rifle', rifleSchema);
