'use strict';

exports.isLoggedIn = function (req, res, next) {
  var err;

  if(!req.user) {
    err = new exports.PermissionError('User is not logged in');
  }

  next(err);
};

exports.onlySelf = function (param, message) {
  return function (req, res, next) {
    var err;

    if(!req.user._id.equals(req.params[param])) {
      err = new exports.PermissionError(message || 'Users can only read their own endpoint');
    }

    next(err);
  };
};


/* Errors
============================================================================= */

exports.PermissionError = function (message) {
  var error = new Error(message);
  error.code = 401;
  return error;
};
