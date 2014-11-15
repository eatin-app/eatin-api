'use strict';

var nconf = require('nconf');
var auth = require('../../utils/auth');
var Client = require('mongoose').model('Client');
var clients = require('express').Router();

module.exports = clients;


clients.use(function (req, res, next) {
  // Allow usage only on local machines
  if(nconf.get('NODE_ENV') === 'development') {
    next();
  }
  else {
    res.status(404).send('Not found');
  }
});

clients.route('/:hostname')
.get(function (req, res) {
  new Client({
    hostname: req.params.hostname,
    urls: {
      confirmation: req.query.confirmation,
      booking: req.query.booking
    }
  }).save(function (err, result, numAffected) {
    if(err) {
      return res.json(err);
    }
    res.json({
      result: result,
      numAffected: numAffected
    });
  });
});
