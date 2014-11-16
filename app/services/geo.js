'use strict';

var request = require('request');
var handlebars = require('handlebars');
var geoApiUrl = handlebars.compile('https://maps.google.com/maps/api/geocode/json?address={{address}},+{{city}}&sensor=false&region=se');

exports.locateUser = function (user, callback) {
  request(geoApiUrl(user), function (err, response, body) {
    var location;

    if(err) {
      return callback(err);
    }

    body = JSON.parse(body);
    location = body.results[0].geometry.location;
    user.geo = [location.lng, location.lat];
    callback(null, user);
  });
};
