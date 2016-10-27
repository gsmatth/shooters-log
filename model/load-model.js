'use strict';

const mongoose = require('mongoose');

const loadSchema = module.exports = mongoose.Schema ({
  userId:            {type: mongoose.Schema.ObjectId, required: true},
  competitionId:     {type: mongoose.Schema.ObjectId},
  matchId:           {type: mongoose.Schema.ObjectId},
  barrelId:          {type: mongoose.Schema.ObjectId},
  rifleId:           {type: mongoose.Schema.ObjectId},
  shotId:            {type: mongoose.Schema.ObjectId},
  brassManufacturer: {type: String},
  powderName:        {type: String},
  powderWeight:      {type: Number},
  bulletName:        {type: String},
  bulletWeight:      {type: Number},
  bulletCaliber:     {type: Number},
  OAL:               {type: Number},
  primeManufacturer: {type: String},
  primeModel:        {type: String},
  muzzleVelocity:    {type: Number},
  standardDeviation: {type: Number},
  extremeSpread:     {type: Number},
  dateCreated:       {type: Date, required: true},
  time:              {type: String},
  temperature:       {type: String},
  humidity:          {type: String}  
});

module.exports = mongoose.model('load', loadSchema);
