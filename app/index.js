'use strict';

var express    = require('express');
var bodyParser = require('body-parser');
var nconf      = require('nconf');
var passport   = require('passport');
var methodOverride = require('method-override');
var cors       = require('cors');

var app        = express();
var model      = require('./model');
var api        = require('./api');


app.use(cors());
app.use(passport.initialize());
app.use(methodOverride('Access-Control-Request-Method'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(api);

module.exports = app;
