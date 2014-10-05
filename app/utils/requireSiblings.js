'use strict';

var fs = require('fs');
var path = require('path');

module.exports = function requireSiblings (filename) {
  return fs.readdirSync(path.dirname(filename)).filter(function (name) {
    return name !== path.basename(filename);
  }).map(function (name) {
    return {
      path: path.basename(name, '.js'),
      module: require(path.join(path.dirname(filename), name))
    };
  });
};
