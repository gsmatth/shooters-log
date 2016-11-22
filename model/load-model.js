'use strict';

const mongoose = require('mongoose');

const loadSchema = module.exports = mongoose.Schema ({
  userId:            {type: mongoose.Schema.ObjectId, required: true},
  competitionId:     {type: mongoose.Schema.ObjectId},
  matchId:           {type: mongoose.Schema.ObjectId},
  barrelId:          {type: mongoose.Schema.ObjectId},
  rifleId:           {type: mongoose.Schema.ObjectId},
  shotId:            {type: mongoose.Schema.ObjectId},
  loadName:          {type: String},
  brassManufacturer: {type: String},
  bulletName:        {type: String},
  bulletWeight:      {type: Number},
  bulletCaliber:     {type: Number},
  primeManufacturer: {type: String},
  primeModel:        {type: String},
  notes:             {type: String},
  dateCreated:       {type: Date, required: true},
  time:              {type: String},
  temperature:       {type: Number},
  humidity:          {type: Number}
});

module.exports = mongoose.model('load', loadSchema);
