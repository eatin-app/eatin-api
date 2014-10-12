'use strict';

exports.isLoggedIn = function (req, res, next) {
  var err;

  if(!req.user) {
    err = new exports.PermissionError('User is not logged in');
  }

  next(err);
};


/* Errors
============================================================================= */

exports.PermissionError = function (message) {
  var error = new Error(message);
  error.code = 401;
  return error;
};
