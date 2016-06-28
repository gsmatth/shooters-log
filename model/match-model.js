'use strict';

const mongoose = require('mongoose');

const matchSchema = module.exports = mongoose.Schema({
  userId:           {type: mongoose.Schema.ObjectId, required: true},
  competitionId:    {type: mongoose.Schema.ObjectId, required: true},
  matchNumber:      {type: Number, required: true},
  targetNumber:     {type: Number, required: true},
  distanceToTarget: {type: Number, required: true},
  relay:            {type: Number, required: true},
  startTime:        {type: String},
  temperature:      {type: Number},
  windDirection:    {type: Number},
  windSpeed:        {type: Number},
  lightDirection:   {type: Number},
  weather:          {type: String}
});

module.exports = mongoose.model('match', matchSchema);
