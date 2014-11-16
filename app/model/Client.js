'use strict';

var mongoose = require('mongoose');


var Client = module.exports = mongoose.Schema({
  created: { type: Date, default: Date.now },
  disabled: { type: Boolean, default: false, index: true },

  hostname: { type: String, required: true, index: { unique: true } },
  urls: {
    confirmation: { type: String },
    booking: { type: String },
    passwordReset: { type: String }
  }
});
