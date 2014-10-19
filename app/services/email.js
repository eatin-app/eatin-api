'use strict';

var mongoose = require('mongoose');
var Email = mongoose.model('Email');
var template = require('./template').email.confirmation;


exports.sendConfirmationEmail = function (user, callback) {
  var email = new Email({
    to: user.email,
    name: user.name,
    subject: 'Confirm your email address',
    text: template({
      name: user.name,
      //## Should not be hardcoded:
      confirmationUrl: 'http://eatin.se/#/confirm?&token=' + user.token
    })
  });

  email.save(callback);
};
