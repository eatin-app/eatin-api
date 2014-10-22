'use strict';

var async = require('async');
var auth = require('../../utils/auth');
var emailService = require('../../services/email');
var bookings = require('express').Router();
var Booking = require('mongoose').model('Booking');

module.exports = bookings;


bookings.use(auth.isLoggedIn);

bookings.route('')
.get(function (req, res) {
  Booking.find(function (err, result) {
    res.json(err || result);
  });
})
.post(function (req, res, next) {
  var data = req.body;
  var booking;

  data.guest = req.user._id;
  booking = new Booking(data);
  booking.messages = [data.message];

  async.waterfall([
    booking.save.bind(booking),
    function (result, __crap, next) {
      emailService.sendBookingNotification(result, next);
    }
  ], function (err) {
    if(err) {
      return next(err);
    }

    res.send();
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
