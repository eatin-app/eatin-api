'use strict';

var passport = require('passport');
var express = require('express');
var sessions = express.Router();

module.exports = sessions;

sessions.route('')
.post(passport.authenticate('local'), function (req, res) {
  res.json(req.user);
});
