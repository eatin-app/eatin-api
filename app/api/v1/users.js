'use strict';

var express = require('express');
var users = express.Router();
var User = require('mongoose').model('User');

module.exports = users;

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
  User.findOne(req.params.id, function (err, result) {
    res.json(err || result);
  });
});
