'use strict';

var mongoose = require('mongoose');


var Booking = module.exports = mongoose.Schema({
  created: { type: Date, default: Date.now },

  status: { type: String, default: 'pending' },
  host: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },
  guest: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },
  messages: [{ type: String }],
  datetime: { type: Date }
});


Booking.methods.accept = function (callback) {
  if(this.status === 'pending') {
    this.status = 'accepted';
  }

  if(callback) {
    return this.save(callback);
  }

  return this;
};

Booking.methods.reject = function (callback) {
  if(this.status === 'pending' || this.status === 'accepted') {
    this.status = 'rejected';
  }

  if(callback) {
    return this.save(callback);
  }

  return this;
};
