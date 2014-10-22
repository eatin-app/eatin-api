'use strict';

var passport = require('passport');
var express = require('express');
var async = require('async');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var auth = require('../../utils/auth');
var sessions = express.Router();


module.exports = sessions;

sessions.route('')
.post(function (req, res, next) {
  passport.authenticate('local', { session: false }, function (err, user, message) {
    if(user) {
      req.user = user;
      return next();
    }

    next(err || auth.PermissionError(message.message));
  })(req, res, next);
}, function (req, res) {
  res.json(req.user);
})
.get(auth.isLoggedIn, function (req, res) {
  if(!req.user.verified) {
    return req.user.set('verified', true).save(function () {
      res.send(req.user);
    });
  }

  res.send(req.user);
})
.delete(auth.isLoggedIn, function (req, res) {
  req.user.deleteToken(function (err) {
    res.json(err || { success: true });
  });
});
