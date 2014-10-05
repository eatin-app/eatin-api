'use strict';

var express    = require('express');
var bodyParser = require('body-parser');
var nconf      = require('nconf');
var app        = express();
var model      = require('./model');
var api        = require('./api');


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


app.use(function (req, res, next) {
  res.set({
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET'
  });

  next();
});

app.use(api);

module.exports = app;
