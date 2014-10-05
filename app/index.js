'use strict';

var express    = require('express');
var bodyParser = require('body-parser');
var nconf      = require('nconf');
var session    = require('express-session');
var passport   = require('passport');
var methodOverride = require('method-override');
var cors       = require('cors');

var app        = express();
var model      = require('./model');
var api        = require('./api');
var redis      = require('redis-url').connect(nconf.get('REDIS_URL'));
var RedisStore = require('connect-redis')(session);


app.use(cors());
app.use(session({
  store: new RedisStore({
    client: redis
  }),
  resave: true,
  saveUninitialized: true,
  secret: nconf.get('COOKIE_SECRET')
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride('Access-Control-Request-Method'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(api);

module.exports = app;
