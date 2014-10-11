'use strict';

var express = require('express');
var requireSiblings = require('../utils/requireSiblings');

module.exports = function useSiblings (filename, routes) {
  routes = routes || express.Router();

  requireSiblings(filename).forEach(function (route) {
    routes.use('/' + route.path, route.module);
  });

  return routes;
};
