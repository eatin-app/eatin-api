'use strict';

var express = require('express');
var users = express.Router();
var User = require('mongoose').model('User');

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
