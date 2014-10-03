'use strict';

var express = require('express');
var users = express.Router();

module.exports = users;

users.route('')
.get(function (req, res) {
  res.json([{
    test: true
  }]);
});

users.route('/:id')
.get(function (req, res) {
  res.json({
    test: true
  });
});
