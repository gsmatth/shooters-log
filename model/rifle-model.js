'use strict';

const mongoose = require('mongoose');

const rifleSchema = module.exports = mongoose.Schema({
  rifleName: {type: String, required: true},
  rifleAction: {type: String, required: true},
  rifleCategory: {type: String, required: true},
  matchId: {type: mongoose.Schema.ObjectId, required: true},
  competitionId: {type: mongoose.Schema.ObjectId, required: true},
  userId: {type: mongoose.Schema.ObjectId, required: true},
  barrelId: {type: mongoose.Schema.ObjectId, required: true}
});

module.exports = mongoose.model('rifle', rifleSchema);
