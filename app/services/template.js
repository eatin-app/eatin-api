'use strict';

var path = require('path');
var fs = require('fs');
var Handlebars = require('handlebars');

var root = path.join(__dirname, '..', 'templates');
var extension = '.hbs';

var templates = module.exports = {};

templates.email = {
  confirmation: getAndCompile('email/confirmation'),
  bookingNotification: getAndCompile('email/bookingNotification'),
  bookingAcceptedNotification: getAndCompile('email/bookingAcceptedNotification'),
  bookingRejectedNotification: getAndCompile('email/bookingRejectedNotification')
};


/* Helpers
============================================================================= */

function getTemplate (template) {
  return fs.readFileSync(path.join(root, template) + extension).toString();
}

function getAndCompile (template) {
  return Handlebars.compile(getTemplate(template));
}
