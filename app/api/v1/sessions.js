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
.delete(function (req, res) {
  async.waterfall([
    User.findOne.bind(User, { token: req.header('Authorization') }),
    function (user, next) {
      user.deleteToken(next);
    }
  ], function (err) {
    res.json(err || { success: true });
  });
});
