'use strict';

var path = require('path');
var fs = require('fs');
var Handlebars = require('handlebars');

var root = path.join(__dirname, '..', 'templates');
var extension = '.hbs';

var templates = module.exports = {};

templates.email = {};
templates.email.confirmation = Handlebars.compile(
  fs.readFileSync(path.join(root, 'email/confirmation') + extension).toString());
templates.email.bookingNotification = Handlebars.compile(
  fs.readFileSync(path.join(root, 'email/bookingNotification') + extension).toString());
