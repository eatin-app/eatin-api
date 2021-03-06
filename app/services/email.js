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
      replyTo: booking.host.email,
      text: templates.bookingAcceptedNotification({
        booking: booking,
        bookingUrl: handlebars.compile(client.urls.booking)({
          bookingId: booking._id
        })
      })
    }).save(callback);
  });
};

exports.sendBookingRejectedNotification = function (client, booking, sendTo, from, callback) {
  booking.populate('host guest', 'name email', function (err, booking) {
    var to = booking[sendTo];

    new Email({
      to: to.email,
      name: to.name,
      subject: 'Din bokning har avslagits',
      replyTo: from.email,
      text: templates.bookingRejectedNotification({
        booking: booking,
        to: to,
        from: from,
        bookingUrl: handlebars.compile(client.urls.booking)({
          bookingId: booking._id
        })
      })
    }).save(callback);
  });
};

exports.sendPasswordReset = function (client, user, callback) {
  new Email({
    to: user.email,
    name: user.name,
    subject: 'Återställ ditt lösenord',
    text: templates.passwordReset({
      user: user,
      resetUrl: handlebars.compile(client.urls.passwordReset)({
        token: user.token
      })
    })
  }).save(callback);
};
