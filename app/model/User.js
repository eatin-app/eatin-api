'use strict';

var mongoose = require('mongoose');

module.exports = mongoose.Schema({
  created: { type: Date, default: Date.now },
  activity: [{ type: Date }],

  email: { type: String, match: /^.+@[^.]+\.[^.]+$/, index: { unique: true } },
  name: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  bio: String,

  trustedBy: [{ type: mongoose.Schema.ObjectId, ref: 'User' }],
  isHost: { type: String, default: false, index: true }
});
