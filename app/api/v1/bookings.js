'use strict';

var express = require('express');
var bookings = express.Router();
var Booking = require('mongoose').model('Booking');
var auth = require('../../utils/auth');

module.exports = bookings;


bookings.use(auth.isLoggedIn);

bookings.route('')
.get(function (req, res) {
  Booking.find(function (err, result) {
    res.json(err || result);
  });
})
.post(function (req, res) {
  var data = req.body;

  data.guest = req.user._id;

  new Booking(data).save(function (err, result) {
    res.status(err && 400 || !result && 404 || 201);
    res.send(err || result);
  });
});


/* /:id
============================================================================= */

bookings.param('id', function (req, res, next, id) {
  Booking.findById(id, function (err, Booking) {
    if(err) {
      return next(err);
    }

    req.Booking = Booking;
    next();
  });
});

bookings.route('/:id')
.get(function (req, res) {
  res.json(req.Booking);
})
.post(function (req, res) {
  req.Booking.set(req.body);
  req.Booking.save(function (err, result) {
    res.json(err || result);
  });
});
