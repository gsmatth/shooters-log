'use strict';

const mongoose = require('mongoose');

const loadSchema = module.exports = mongoose.Schema ({
  userId:            {type: mongoose.Schema.ObjectId, required: true},
  competitionId:     {type: mongoose.Schema.ObjectId, required: true},
  matchId:           {type: mongoose.Schema.ObjectId, required: true},
  barrelId:          {type: mongoose.Schema.ObjectId, required: true},
  rifleId:           {type: mongoose.Schema.ObjectId, required: true},
  shotId:            {type: mongoose.Schema.ObjectId, required: true},
  brassManufacturer: {type: String},
  powderName:        {type: String},
  powderWeight:      {type: Number},
  bulletName:        {type: String},
  bulletWeight:      {type: Number},
  bulletCaliber:     {type: Number},
  OAL:               {type: Number},
  primeManufacturer: {type: String},
  primeModel:        {type: String},
  muzzleVelocity:    {type: Number}
});

module.exports = mongoose.model('load', loadSchema);
