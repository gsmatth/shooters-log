'use strict';

const mongoose = require('mongoose');

const testLoadSchema = module.exports = mongoose.Schema({
  userId:    {type: mongoose.Schema.ObjectId, required: true},
  loadId:    {type: mongoose.Schema.ObjectId, required: true},
  testShots: {type: Array, required: true}
});

module.exports = mongoose.model('testLoad', testLoadSchema);
