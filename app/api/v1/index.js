'use strict';

var useSiblings = require('../../utils/useSiblings');
var express = require('express');
var mongoose = require('mongoose');
var auth = require('../../utils/auth');
var User = mongoose.model('User');
var Client = mongoose.model('Client');
var routes = express.Router();

// Fetch client data
routes.use(function (req, res, next) {
  Client.findOne({
    hostname: req.header('X-Client'),
    disabled: false
  }, function (err, client) {
    if(err) {
      return next(err);
    }

    req.client = client;
    next();
  });
});

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
  console.error(req.path);
  console.error(err.message);
  console.error(err.stack);

  res.status(err.code || 500).json({
    error: err.message
  });
});
