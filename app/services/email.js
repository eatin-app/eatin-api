'use strict';

var mongoose = require('mongoose');
var Email = mongoose.model('Email');
var templates = require('./template').email;


exports.sendConfirmationEmail = function (user, callback) {
  var email = new Email({
    to: user.email,
    name: user.name,
    subject: 'Confirm your email address',
    text: templates.confirmation({
      name: user.name,
      //## Should not be hardcoded:
      confirmationUrl: 'http://eatin.se/#/confirm?&token=' + user.token
    })
  });

  email.save(callback);
};

exports.sendBookingNotification = function (booking, callback) {
  booking.populate('host guest', 'name email', function (err, booking) {
    new Email({
      to: booking.host.email,
      name: booking.host.name,
      subject: 'Du har fått en Eat in-förfrågan',
      replyTo: booking.guest.email,
      text: templates.bookingNotification(booking)
    }).save(callback);
  });
};
