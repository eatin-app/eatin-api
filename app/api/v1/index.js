'use strict';

var useSiblings = require('../../utils/useSiblings');
var express = require('express');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var routes = express.Router();

// Fecth user if logged in
routes.use(function (req, res, next) {
  if(!req.header('Authorization')) {
    return next();
  }

  User.findOne({ token: req.header('Authorization') }, function (err, user) {
    if(user) {
      req.user = user;
    }

    next(err);
  });
});

module.exports = useSiblings(__filename, routes);

// Error handler
routes.use(function (err, req, res, next) {
  res.status(err.code || 500).json({
    error: err.message
  });
});
