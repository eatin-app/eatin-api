'use strict';

var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var passport = require('passport');
var LocalStrategy = require('passport-local');
var BearerStrategy = require('passport-http-bearer');
var async = require('async');
var uuid = require('uuid');
var nconf = require('nconf');
var SALT_WORK_FACTOR = 10;


var User = module.exports = mongoose.Schema({
  created: { type: Date, default: Date.now },
  activity: [{ type: Date }],

  email: { type: String, match: /^.+@[^.]+\.[^.]+$/, required: true, index: { unique: true } },
  name: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  zip: { type: String, required: true },
  geo: { type: [Number], index: '2dsphere' },
  bio: String,

  password: { type: String, required: true },
  token: { type: String },
  trustedBy: [{ type: mongoose.Schema.ObjectId, ref: 'User' }],
  isHost: { type: Boolean, default: false, index: true },
  verified: { type: Boolean, default: false },
  profileImage: { type: mongoose.Schema.ObjectId, ref: 'Media' },
  backgroundImage: { type: mongoose.Schema.ObjectId, ref: 'Media' }
});


/* Virtuals
============================================================================= */

User.virtual('profileImageUrl')
.get(function () {
  return nconf.get('FIRESIZE_TEMPLATE_URL') + '/' + nconf.get('IMAGE_ROOT_URL') + '/' + this.profileImage;
});

/* Hooks
============================================================================= */

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

/* Methods
============================================================================= */

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
  user.profileImageUrl = this.profileImageUrl;
  return user;
};

User.methods.generateToken = function (callback) {
  this.token = uuid.v4();

  if(callback) {
    return this.save(callback);
  }

  return this;
};

User.methods.deleteToken = function (callback) {
  this.token = '';

  if(callback) {
    return this.save(callback);
  }

  return this;
};

User.methods.create = function (callback) {
  var self = this;
  var unsettable = ['created', 'activity', 'token', 'trustedBy', 'verified'];

  unsettable.forEach(function (property) {
    if(property in self) {
      delete self[property];
    }
  });

  self.generateToken();

  self.save(callback);
};


/* Passport
============================================================================= */

passport.use(new LocalStrategy({
  usernameField: 'email'
}, function (email, password, done) {
  var User = mongoose.model('User');
  var user;

  async.waterfall([
    User.findOne.bind(User, { email: email }),
    function (_user, next) {
      if(!_user) {
        return next({ message: 'Wrong username' });
      }

      user = _user;

      user.comparePassword(password, next);
    },
    function (isMatch, next) {
      if(!isMatch) {
        return next(null, null, { message: 'Wrong password' });
      }
      if(!user.verified) {
        return next(null, null, { message: 'Email not verified' });
      }

      user.generateToken(next);
    }
  ], function (err, user, message) {
    if(err) {
      if(err instanceof Error) {
        return done(err);
      }

      message = err;
    }

    done(null, user || false, message);
  });
}));

passport.use(new BearerStrategy(function (token, done) {
  var User = mongoose.model('User');

  User.findOne({ token: token }, function (err, user) {
    if(err) {
      return done(err);
    }

    return done(null, user || false);
  });
}));
