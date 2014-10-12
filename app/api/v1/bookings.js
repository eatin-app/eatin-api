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
  Booking.findById(id)
  .populate('host')
  .populate('guest')
  .exec(function (err, Booking) {
    if(err) {
      return next(err);
    }

    req.booking = Booking;
    next();
  });
});

bookings.route('/:id')
.get(function (req, res) {
  res.json(req.booking);
})
.post(function (req, res, next) {
  var booking = req.booking;

  if(req.user._id !== booking.host._id) {
    return next(new auth.PermissionError('Only the host can accept bookings'));
  }

  if(req.body.datetime && !isNaN(new Date(req.body.datetime).getTime())) {
    booking.set('datetime', req.body.datetime);
  }

  if(req.body.status) {
    //## For now, assume that status can only be changed to "accepted" when using POST
    booking.set('status', 'accepted');
  }

  booking.save(function (err, result) {
    if(err) {
      return next(err);
    }

    res.json(result);
  });
})
.delete(function (req, res, next) {
  var booking = req.booking;

  if(
    !req.user._id.equals(booking.host._id) &&
    !req.user._id.equals(booking.guest._id)
  ) {
    return next(new auth.PermissionError('Only a host or guest can cancel bookings'));
  }

  booking.set('status', 'rejected');

  booking.save(function (err, result) {
    if(err) {
      return next(err);
    }

    res.json(result);
  });
});
