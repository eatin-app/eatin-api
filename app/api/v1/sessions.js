'use strict';

var passport = require('passport');
var express = require('express');
var async = require('async');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var sessions = express.Router();

module.exports = sessions;

sessions.route('')
.post(passport.authenticate('local', { session: false }), function (req, res) {
  res.json(req.user);
})
.get(function (req, res) {
  res.send(req.user);
})
.delete(function (req, res) {
  if(!req.user) {
    //## Replace this with general req.isLoggedIn() or something
    return res.json(401, {});
  }

  req.user.deleteToken(function (err) {
    res.json(err || { success: true });
  });
});
