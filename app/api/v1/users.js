'use strict';

var express = require('express');
var users = express.Router();
var mongoose = require('mongoose');
var async = require('async');
var multiparty = require('multiparty');

var User = mongoose.model('User');
var Media = mongoose.model('Media');
var Booking = mongoose.model('Booking');

var emailService = require('../../services/email');
var imageService = require('../../services/image');
var s3Service = require('../../services/s3');
var auth = require('../../utils/auth');
var sizes = Media.sizes;

module.exports = users;


users.param('userId', function (req, res, next, id) {
  User.findById(id, function (err, user) {
    if(err) {
      return next(err);
    }

    req.requestedUser = user;
    next();
  });
});

/* /
============================================================================= */

users.route('')
.get(function (req, res, next) {
  User.find({
    isHost: true
  }, function (err, result) {
    if(err) {
      return next(err);
    }

    res.json(result);
  });
})
.post(auth.isValidClient, function (req, res, next) {
  var newUser = new User(req.body);
  //## Validation

  async.series([
    newUser.create.bind(newUser),
    emailService.sendConfirmationEmail.bind(null, req.client, newUser)
  ], function (err) {
    if(err) {
      return next(err);
    }

    res.status(201).send();
  });
});

/* /random
============================================================================= */

users.route('/random')
.get(function (req, res, next) {
  async.waterfall([
    User.count.bind(User, {
      isHost: true
    }),
    function (count, done) {
      User.find()
      .where({
        isHost: true
      })
      .skip(Math.floor(Math.random() * count))
      .limit(1)
      .exec(done);
    }
  ], function (err, host) {
    if(err) {
      return next(err);
    }

    res.send(host);
  });
});

/* /:id
============================================================================= */

users.route('/:userId')
.get(function (req, res) {
  res.json(req.requestedUser);
})
.post(auth.isLoggedIn, auth.onlySelf('userId'),
function (req, res, next) {
  req.user.set(req.body);
  req.user.save(function (err, result) {
    if(err) {
      return next(err);
    }

    res.json(result);
  });
});

/* /:id/profileImage
============================================================================= */

users.route('/:userId/profileImage')
.all(auth.isLoggedIn, auth.onlySelf('userId'))
.post(function (req, res, next) {
  var form = new multiparty.Form();
  var file = new Media({
    uploader: req.user._id
  });

  form.parse(req);

  async.series([
    function (done) {
      form.on('error', done);
      form.on('part', function (part) {
        if(part.filename) {
          done(null, part);
        }
      });
    },
    file.save.bind(file)
  ], function (err, results) {
    if(err) {
      return next(err);
    }

    var image = results[0];
    var file = results[1][0];

    image.filename = file._id;
    image.filesize = image.byteCount;
    image.mimetype = 'image/jpg';

    async.series([
      //## To hell with resizing for now
      //## imageService.resize.bind(null, image, sizes),
      s3Service.upload.bind(null, image),
      file.update.bind(file, { stored: true }),
      req.user.update.bind(req.user, { profileImage: file._id })
    ],
    function (err) {
      if(err) {
        return next(err);
      }

      res.status(201).json({
        profileImage: file._id
      });
    });
  });
});

/* Per-user bookings
============================================================================= */

users.route('/:userId/bookouts')
.all(auth.isLoggedIn, auth.onlySelf('userId'))
.get(function (req, res, next) {
  Booking.find({
    guest: req.params.userId,
    status: 'accepted'
  })
  .populate('host')
  .populate('guest')
  .exec(function (err, bookings) {
    if(err) {
      return next(err);
    }

    res.json(bookings);
  });
});

users.route('/:userId/bookins')
.all(auth.isLoggedIn, auth.onlySelf('userId'))
.get(function (req, res, next) {
  Booking.find({
    host: req.params.userId,
    status: 'accepted'
  })
  .populate('host')
  .populate('guest')
  .exec(function (err, bookings) {
    if(err) {
      return next(err);
    }

    res.json(bookings);
  });
});

users.route('/:userId/requests')
.all(auth.isLoggedIn, auth.onlySelf('userId'))
.get(function (req, res, next) {
  Booking.find({
    host: req.params.userId,
    status: 'pending'
  })
  .populate('host')
  .populate('guest')
  .exec(function (err, bookings) {
    if(err) {
      return next(err);
    }

    res.json(bookings);
  });
});
