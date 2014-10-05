'use strict';

var mongoose = require('mongoose');
var requireSiblings = require('../utils/requireSiblings');
var models = requireSiblings(__filename);
var nconf = require('nconf');

mongoose.connect(nconf.get('DB_URI'));

mongoose.connection.on('connected', function () {
  console.log('Mongoose connected to %s', nconf.get('DB_URI'));
});

models.forEach(function (model) {
  mongoose.model(model.path, model.module);
});
