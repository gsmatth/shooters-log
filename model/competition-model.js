'use strict';

const debug = require('debug')('shooter:competition-model');
const mongoose = require('mongoose');

const competitionSchema = module.exports=mongoose.Schema({
  user_id: {type: mongoose.Schema.ObjectId, required:true},
  location: {type: String, required: true},
  action: {type: String, required: true}
});






module.exports = mongoose.model('competition', competitionSchema );
