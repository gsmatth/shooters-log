'use strict';

const mongoose = require('mongoose');

const barrelSchema = module.exports = mongoose.Schema({
  barrelName: {type: String},
  barrelManufacturer: {type: String},
  barrelType: {type: String},
  barrelTwist: {type: String},
  barrelLength: {type: Number},
  barrelLife: {type: Number},
  barrelCaliber: {type: Number},
  roundCount: {type: Number},
  matchId:{type: mongoose.Schema.ObjectId},
  competitionId:{type: mongoose.Schema.ObjectId},
  userId:{type: mongoose.Schema.ObjectId, required: true},
  rifleId: {type: mongoose.Schema.ObjectId}
});


module.exports = mongoose.model('barrel', barrelSchema);
