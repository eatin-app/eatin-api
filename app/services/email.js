'use strict';

var mongoose = require('mongoose');
var Email = mongoose.model('Email');
var templates = require('./template').email;
var handlebars = require('handlebars');


exports.sendConfirmationEmail = function (client, user, callback) {
  var email = new Email({
    to: user.email,
    name: user.name,
    subject: 'Confirm your email address',
    text: templates.confirmation({
      name: user.name,
      //## Should not be hardcoded:
      confirmationUrl: handlebars.compile(client.urls.confirmation)({
        token: user.token
      })
    })
  });

  email.save(callback);
};

exports.sendBookingNotification = function (client, booking, callback) {
  booking.populate('host guest', 'name email', function (err, booking) {
    new Email({
      to: booking.host.email,
      name: booking.host.name,
      subject: 'Du har fått en Eatin-förfrågan',
      replyTo: booking.guest.email,
      text: templates.bookingNotification({
        booking: booking,
        bookingUrl: handlebars.compile(client.urls.booking)({
          bookingId: booking._id
        })
      })
    }).save(callback);
  });
};

exports.sendBookingAcceptedNotification = function (client, booking, callback) {
  booking.populate('host guest', 'name email', function (err, booking) {
    new Email({
      to: booking.guest.email,
      name: booking.guest.name,
      subject: 'Din Eatin-förfrågan har accepterats',
      replyTo: booking.guest.email,
      text: templates.bookingAcceptedNotification({
        booking: booking,
        bookingUrl: handlebars.compile(client.urls.booking)({
          bookingId: booking._id
        })
      })
    }).save(callback);
  });
};
