'use strict';

var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var passport = require('passport');
var LocalStrategy = require('passport-local');
var SALT_WORK_FACTOR = 10;


var User = module.exports = mongoose.Schema({
  created: { type: Date, default: Date.now },
  activity: [{ type: Date }],

  email: { type: String, match: /^.+@[^.]+\.[^.]+$/, required: true, index: { unique: true } },
  name: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  bio: String,

  password: { type: String, required: true },
  trustedBy: [{ type: mongoose.Schema.ObjectId, ref: 'User' }],
  isHost: { type: String, default: false, index: true }
});


User.pre('save', function(next) {
  var user = this;

  if(!user.isModified('password')) {
    return next();
  }

  bcrypt.hash(user.password, SALT_WORK_FACTOR, function (err, hash) {
    if(err) {
      return next(err);
    }

    // Override the cleartext password with the hashed one
    user.password = hash;
    next();
  });
});

User.methods.comparePassword = function(candidatePassword, callback) {
  bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
    if(err) {
      return callback(err);
    }

    callback(null, isMatch);
  });
};

User.methods.toJSON = function () {
  var user = this.toObject();
  delete user.password;
  return user;
};


/* Passport
============================================================================= */

passport.use(new LocalStrategy({
  usernameField: 'email'
}, function (email, password, done) {
  var User = mongoose.model('User');

  User.findOne({ email: email }, function (err, user) {
    if(err) {
      return done(err);
    }

    if(!user) {
      return done(null, false);
    }

    user.comparePassword(password, function (err, isMatch) {
      if(err) {
        return done(err);
      }

      return done(null, isMatch && user);
    });
  });
}));

passport.serializeUser(function(user, done) {
  done(null, user._id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

