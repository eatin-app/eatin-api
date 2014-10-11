'use strict';

exports.isLoggedIn = function (req, res, next) {
  var err;

  if(!req.user) {
    err = new Error('User is not logged in');
    err.code = 401;
  }

  next(err);
};
