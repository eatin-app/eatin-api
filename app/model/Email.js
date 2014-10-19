'use strict';

var nconf = require('nconf');
var mongoose = require('mongoose');
var mandrill = require('node-mandrill')(nconf.get('MANDRILL_KEY'));
var async = require('async');
var interval = nconf.get('MAIL_QUEUE_INTERVAL_MINUTES');


/**
 * Queue for outgoing email
 */

var Email = module.exports = mongoose.Schema({
  created: { type: Date, default: Date.now },
  processed: { type: Date, default: 0, index: true },
  sent: { type: Boolean, default: false, index: true },

  to: { type: String, match: /^.+@[^.]+\.[^.]+$/, required: true },
  name: { type: String, required: true },
  subject: { type: String, required: true },
  text: { type: String, required: true }
});


/**
 * Process queue
 */
setImmediate(function () {
  async.forever(function (done) {
    var Email = mongoose.model('Email');

    async.waterfall([
      function (next) {
        Email.findOneAndUpdate({
          // This will retry emails that were supposed to be sent more than 5 mins ago
          // but not marked so. Better one too many than one too few emails sent
          processed: { $lt: Date.now() - 1000 * 60 * 5 },
          sent: false
        }, {
          processed: Date.now()
        }, next);
      },
      function (outgoing, next) {
        next(!outgoing && new Error('No outgoing emails found'), outgoing);
      },
      function (outgoing, next) {
        console.log('Processing email');

        mandrill('/messages/send', {
          message: {
            'from_email': nconf.get('EMAIL_FROM'),
            to: [{
              email: outgoing.to,
              name: outgoing.name
            }],
            subject: outgoing.subject,
            text: outgoing.text,
          }
        }, function (err) {
          next(err, outgoing);
        });
      },
      function (outgoing, next) {
        console.log('Email sent');
        outgoing.set('sent', true);

        outgoing.save(next);
      },
      function (res, numberAffected, next) {
        console.log('Email saved as sent');
        next();
      }
    ], function (err) {
      if(err) {
        console.error(err);
        console.log('Waiting for ' + interval + ' minutes before trying again');
        setTimeout(done, interval * 1000 * 60);
      }
      else {
        done();
      }
    });
  }, function error (err) {
    //## Notify admin?
    //## Notify admin if more than n emails in queue for more than x iterations in a row?
    console.error('Outbox processing interrupted');
    console.error(err);
  });
});
