'use strict';

var express = require('express');
var users = express.Router();
var mongoose = require('mongoose');
var User = mongoose.model('User');
var Booking = mongoose.model('Booking');
var auth = require('../../utils/auth');

module.exports = users;


users.param('id', function (req, res, next, id) {
  User.findById(id, function (err, user) {
    if(err) {
      return next(err);
    }

    req.user = user;
    next();
  });
});

users.route('')
.get(function (req, res) {
  User.find(function (err, result) {
    res.json(err || result);
  });
})
.post(function (req, res) {
  new User(req.body).save(function (err, result) {
    res.status(err && 400 || !result && 404 || 201);
    res.send(err || result);
  });
});

users.route('/:id')
.get(function (req, res) {
  res.json(req.user);
})
.post(function (req, res) {
  req.user.set(req.body);
  req.user.save(function (err, result) {
    res.json(err || result);
  });
});

users.route('/:id/bookouts')
.all(auth.isLoggedIn)
.get(function (req, res, next) {
  Booking.find({
    guest: req.user._id,
    status: 'accepted'
  })
  .populate('host')
  .populate('guest')
  .exec(function (err, bookings) {
    if(err) {
      return next(err);
    }

    res.json(bookings);
  });
});

users.route('/:id/bookins')
.all(auth.isLoggedIn)
.get(function (req, res, next) {
  Booking.find({
    host: req.user._id,
    status: 'accepted'
  })
  .populate('host')
  .populate('guest')
  .exec(function (err, bookings) {
    if(err) {
      return next(err);
    }

    res.json(bookings);
  });
});

users.route('/:id/requests')
.all(auth.isLoggedIn)
.get(function (req, res, next) {
  Booking.find({
    host: req.user._id,
    status: 'pending'
  })
  .populate('host')
  .populate('guest')
  .exec(function (err, bookings) {
    if(err) {
      return next(err);
    }

    res.json(bookings);
  });
});
