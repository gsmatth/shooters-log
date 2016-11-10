'use strict';

const mongoose = require('mongoose');

const testLoadSchema = module.exports = mongoose.Schema({
  userId:       {type: mongoose.Schema.ObjectId, required: true},
  loadId:       {type: mongoose.Schema.ObjectId, required: true},
  powderName:   {type: String},
  powderWeight: {type: Number},
  OAL:          {type: Number},
  testShots:    {type: Array, 'default' : [], required: true},
  groupSize:    {type: Number}
});

module.exports = mongoose.model('testLoad', testLoadSchema);
